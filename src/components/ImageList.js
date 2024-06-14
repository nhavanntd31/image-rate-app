import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from './ImageCard';
import Pagination from './Pagination';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';

const ImageList = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageData, setImageData] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const imagesPerPage = 20;

  useEffect(() => {
    const loadImages = async () => {
      const totalImages = 1000; // Assuming 1000 images
      const imageList = Array.from({ length: totalImages }, (_, i) => `${i + 1}`);
      setImages(imageList);
    };

    loadImages();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleSave = async () => {
    const startIdx = (currentPage - 1) * imagesPerPage;
    const currentImages = images.slice(startIdx, startIdx + imagesPerPage);
    const dataToSave = currentImages.map(img => ({
      id: img,
      quality: imageData[img]?.quality || 1,
      class: imageData[img]?.class || 0,
      comment: imageData[img]?.comment || 'no description'
    }));

    try {
      // Fetch existing data from the sheet to determine if an ID exists
      const response = await axios.get('https://sheet.best/api/sheets/32649da8-4893-4bfd-a925-e970d6a3f53f');
      const existingData = response.data;

      // Create a set of existing IDs for faster lookup
      const existingDataIds = new Set(existingData.map(item => item.id));

      // Create an array of promises for conditional updates (PUT or POST)
      const savePromises = dataToSave.map(item => {
        const url = `https://sheet.best/api/sheets/32649da8-4893-4bfd-a925-e970d6a3f53f/id/${item.id}`;

        if (existingDataIds.has(item.id)) {
          // If ID exists, update (PUT) the existing row
          return axios.put(url, {
            id: item.id,
            class: item.class,
            quality: item.quality,
            comment: item.comment
          });
        } else {
          // If ID does not exist, add (POST) a new row
          return axios.post('https://sheet.best/api/sheets/32649da8-4893-4bfd-a925-e970d6a3f53f', {
            id: item.id,
            class: item.class,
            quality: item.quality,
            comment: item.comment
          });
        }
      });

      // Execute all save promises concurrently
      await Promise.all(savePromises);

      alert('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  const handleChange = (img, field, value) => {
    setImageData(prevData => ({
      ...prevData,
      [img]: {
        ...prevData[img],
        [field]: value
      }
    }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(images.length / imagesPerPage)) {
      setCurrentPage(page);
    }
  };

  const openModal = (img) => {
    setModalImage(img);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const startIdx = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIdx, startIdx + imagesPerPage);

  return (
    <div className="container">
      <TransitionGroup className="image-list">
        {currentImages.map((img, idx) => (
          <CSSTransition key={img} timeout={300} classNames="fade">
            <ImageCard
              key={img}
              image={img}
              data={imageData[img]}
              onChange={handleChange}
              onClick={() => openModal(img)}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(images.length / imagesPerPage)}
        onPageChange={handlePageChange}
      />
      <input
        type="number"
        className="page-input"
        value={currentPage}
        onChange={(e) => handlePageChange(Number(e.target.value))}
        min="1"
        max={Math.ceil(images.length / imagesPerPage)}
      />
      <button className="save-button" onClick={handleSave}>Save Data</button>
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={`/data/${modalImage}.png`} alt={`${modalImage}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageList;
