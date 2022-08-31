import { createMarkup } from './js/create-markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let gallery = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
gallery.on('show.simplelightbox');
import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '29606139-306393987ee25a09df02ffe92',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};
const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

let inputSearchQuery = '';
let pageNamber = 1;
const per_page = 40;

refs.searchForm.addEventListener('submit', onButtonClick);

function onButtonClick(e) {
  e.preventDefault();
  const { searchQuery } = e.target.elements;
  inputSearchQuery = searchQuery.value.trim();
  refs.loadMore.classList.add('is-hidden');
  pageNamber = 1;

  if (inputSearchQuery.length === 0) {
    return Notify.info('Enter data to search!', {
      backOverlay: true,
      backOverlayColor: 'rgba(255, 85, 73, 0.2)',
      fontSize: '18px',
      timeout: 2000,
      clickToClose: true,
      position: 'center-top',
    });
  }
  getPixabayPhoto(inputSearchQuery)
    .then(renderMarkup)
    .catch(() => onError('Something went wrong'))
    .finally(() => {
      addNextPage();
      refs.loadMore.classList.remove('is-hidden');
    });

  cleargallery();
}

function getPixabayPhoto(inputSearchQuery) {
  return axios
    .get(`?q=${inputSearchQuery}&page=${pageNamber}`)
    .then(response => {
      return response;
    });
}

function renderMarkup({ data: { hits, totalHits } }) {
  if (hits.length === 0) {
    refs.loadMore.classList.add('is-hidden');
    return onError();
  }
  Notify.info(`Hooray! We found ${totalHits} images.`, {
    fontSize: '18px',
    timeout: 1000,
    clickToClose: true,
    position: 'center-top',
  });
  const FilteredPhoto = hits.map(createMarkup).join('');
  refs.gallery.insertAdjacentHTML('beforeend', FilteredPhoto);
  gallery.refresh();
  // refs.loadMore.classList.remove('is-hidden');
  if (totalHits / per_page <= pageNamber) {
    refs.loadMore.classList.add('is-hidden');
    return Notify.info(
      "We're sorry, but you've reached the end of search results.",
      {
        backOverlay: true,
        backOverlayColor: 'rgba(255, 85, 73, 0.2)',
        fontSize: '18px',
        timeout: 2000,
        clickToClose: true,
        position: 'center-top',
      }
    );
  }
}

function onError(message) {
  return Notify.failure(
    message ||
      'Sorry, there are no images matching your search query. Please try again.',
    {
      backOverlay: true,
      backOverlayColor: 'rgba(255, 85, 73, 0.2)',
      fontSize: '18px',
      timeout: 2000,
      clickToClose: true,
      position: 'center-top',
    }
  );
}

refs.loadMore.addEventListener('click', onButtonDownloadMorePhotos);

function onButtonDownloadMorePhotos() {
  getPixabayPhoto(inputSearchQuery)
    .then(renderMarkup)
    .catch(onError)
    .finally(addNextPage);
}

function cleargallery() {
  refs.gallery.innerHTML = '';
}
function addNextPage() {
  pageNamber += 1;
}
