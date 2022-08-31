import { createMarkup } from './js/create-markup';
import ServicePixabayApi from './js/service-pixabay-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let gallery = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});
gallery.on('show.simplelightbox');

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

const servicePixabayApi = new ServicePixabayApi();

refs.searchForm.addEventListener('submit', onButtonClick);
refs.loadMore.addEventListener('click', onButtonDownloadMorePhotos);

function onButtonClick(e) {
  e.preventDefault();
  const { searchQuery } = e.target.elements;
  servicePixabayApi.SearchQuery = searchQuery.value.trim();
  servicePixabayApi.resetPage();

  if (servicePixabayApi.SearchQuery.length === 0) {
    return Notify.info('Enter data to search!', {
      backOverlay: true,
      backOverlayColor: 'rgba(255, 85, 73, 0.2)',
      fontSize: '18px',
      timeout: 2000,
      clickToClose: true,
      position: 'center-top',
    });
  }
  cleargallery();
  refs.loadMore.classList.add('is-hidden');

  servicePixabayApi
    .getPixabayPhoto()
    .then(renderMarkup)
    .catch(() => onError('Something went wrong'));
}

function renderMarkup({ data: { hits, totalHits } }) {
  console.log(hits);
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
  refs.loadMore.classList.remove('is-hidden');

  gallery.refresh();
  const TOTAL_PAGES = totalHits / servicePixabayApi.PER_PAGE;
  console.log(TOTAL_PAGES);
  console.log(servicePixabayApi.pageNamber);
  if (TOTAL_PAGES <= servicePixabayApi.pageNamber - 1) {
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

function onButtonDownloadMorePhotos() {
  servicePixabayApi.getPixabayPhoto().then(renderMarkup).catch(onError);
}

function cleargallery() {
  refs.gallery.innerHTML = '';
}
