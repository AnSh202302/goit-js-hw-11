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
let isShow = 0;

ref.form.addEventListener('submit', handlerSearchImg);
ref.btnLoadMore.addEventListener('click', handlerBtnLoadMoreClick);

ref.btnLoadMore.classList.add('is-hidden');

function handlerSearchImg(e) {
  e.preventDefault();
  ref.gallery.innerHTML = '';
  pixabayApiInstance.page = 1;
  pixabayApiInstance.searchTerm = ref.form[0].value.trim();
  if (pixabayApiInstance.searchTerm === '') {
    Notiflix.Notify.warning('Please, fill the main field');
    return;
  }
  //   isShow = 0;
  fenchGallery();
}

async function fenchGallery() {
  const response = await pixabayApiInstance.fetchImg();
  const { hits, totalHits, total } = response;
  console.log(response);
  isShow += hits.length;
  console.log(`Hooray! We found ${isShow} images.`);
  ref.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
  });
  lightbox.refresh();
  if (hits.length === 0 || isShow > totalHits) {
    ref.btnLoadMore.classList.add('is-hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else if (isShow < total) {
    ref.btnLoadMore.classList.remove('is-hidden');
  }
}

function handlerBtnLoadMoreClick() {
  pixabayApiInstance.incrementPage();
  fenchGallery();
}
