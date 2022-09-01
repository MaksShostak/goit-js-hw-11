import { refs } from './js/refs';
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

const servicePixabayApi = new ServicePixabayApi();

refs.searchForm.addEventListener('submit', onButtonClick);
refs.loadMore.addEventListener('click', onButtonDownloadMorePhotos);

async function onButtonClick(e) {
  e.preventDefault();
  const { searchQuery } = e.target.elements;
  servicePixabayApi.SearchQuery = searchQuery.value.trim();
  servicePixabayApi.resetPage();

  if (servicePixabayApi.SearchQuery.length === 0) {
    Notify.info('Enter data to search!', {
      backOverlay: true,
      backOverlayColor: 'rgba(255, 85, 73, 0.2)',
      fontSize: '18px',
      timeout: 2000,
      clickToClose: true,
      position: 'center-top',
    });
    return;
  }
  cleargallery();
  refs.loadMore.classList.add('is-hidden');

  try {
    const { hits, totalHits } = await servicePixabayApi.getPixabayPhoto();
    if (hits.length === 0) {
      return onError();
    }

    renderMarkup(hits, totalHits);
    refs.loadMore.classList.remove('is-hidden');
    Notify.info(`Hooray! We found ${totalHits} images.`, {
      fontSize: '18px',
      timeout: 1000,
      clickToClose: true,
      position: 'center-top',
    });
  } catch (error) {
    onError('Something went wrong');
  }
}

async function onButtonDownloadMorePhotos() {
  try {
    const { hits, totalHits } = await servicePixabayApi.getPixabayPhoto();
    renderMarkup(hits, totalHits);
  } catch (error) {
    onError('Something went wrong');
  }
}

function renderMarkup(hits, totalHits) {
  const FilteredPhoto = hits.map(createMarkup).join('');
  refs.gallery.insertAdjacentHTML('beforeend', FilteredPhoto);
  gallery.refresh();
  servicePixabayApi.totalPhoto = totalHits;

  const hasMorePhotos = servicePixabayApi.hasMorePhotos();

  if (!hasMorePhotos) {
    refs.loadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.", {
      backOverlay: true,
      backOverlayColor: 'rgba(255, 85, 73, 0.2)',
      fontSize: '18px',
      timeout: 2000,
      clickToClose: true,
      position: 'center-top',
    });
    return;
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

function cleargallery() {
  refs.gallery.innerHTML = '';
}
