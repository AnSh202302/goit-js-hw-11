import Notiflix from 'notiflix';
import pixabayAPI from './pixabayApi';
import { createMarkup } from './markupImg';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApiInstance = new pixabayAPI();
const ref = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionDelay: 250,
});

const notiflixOptions = {
  width: '300px',
  position: 'center-center',
  borderRadius: '12px',
  timeout: 2000,
  cssAnimationStyle: 'zoom',
};

let isShow = 0;

ref.form.addEventListener('submit', handlerSearchImg);
ref.btnLoadMore.addEventListener('click', handlerBtnLoadMoreClick);

ref.btnLoadMore.classList.add('is-hidden');

function handlerSearchImg(e) {
  e.preventDefault();
  ref.gallery.innerHTML = '';

  ref.btnLoadMore.classList.add('is-hidden');

  pixabayApiInstance.page = 1;
  pixabayApiInstance.searchTerm = ref.form[0].value.trim();
  isShow = 0;

  if (pixabayApiInstance.searchTerm === '') {
    Notiflix.Notify.warning('Please, fill the main field', notiflixOptions);
    return;
  }
  fenchGallery();
}

async function fenchGallery() {
  const response = await pixabayApiInstance.fetchImg();
  const { hits, totalHits } = response;
  isShow += hits.length;
  if (!hits.length || isShow >= totalHits) {
    ref.btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (isShow < totalHits) {
    ref.btnLoadMore.classList.remove('is-hidden');
    Notiflix.Notify.success(
      `Hooray! We found ${totalHits} images.`,
      notiflixOptions
    );
  }
  ref.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  lightbox.refresh();
}
function handlerBtnLoadMoreClick() {
  pixabayApiInstance.incrementPage();
  fenchGallery();
}
