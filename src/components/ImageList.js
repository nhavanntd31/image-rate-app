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
      const imageList = Array.from({ length: totalImages }, (_, i) => `${i + 1}`.padStart(4, '0'));
      setImages(imageList);
    };

    loadImages();
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handleSave = async () => {
    const currentImages = images.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);
    const dataToSave = currentImages.map(img => ({
      id: img,
      quality: imageData[img]?.quality || 1,
      class: imageData[img]?.class || 0,
      comment: imageData[img]?.comment || ''
    }));
    await axios.post('http://localhost:5000/api/save', dataToSave);
    alert('Data saved successfully!');
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

  const handlePageChange = (e) => {
    const page = Number(e.target.value);
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
        onPageChange={setCurrentPage}
      />
      <input
        type="number"
        className="page-input"
        value={currentPage}
        onChange={handlePageChange}
        min="1"
        max={Math.ceil(images.length / imagesPerPage)}
      />
      <button className="save-button" onClick={handleSave}>Save Data</button>
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={`/data1/${modalImage}.png`} alt={`${modalImage}`} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageList;
