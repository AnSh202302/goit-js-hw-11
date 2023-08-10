import axios from 'axios';
export default class pixabayAPI {
  BASE_URL = 'https://pixabay.com/api/';
  KEY = '38692594-46caa16db684ae3e3990f61b0';
  searchTerm = 'cat';
  page = 1;

  async fetchImg() {
    const searchParams = new URLSearchParams({
      key: this.KEY,
      q: `${this.searchTerm}`,
      image_type: 'foto',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: this.page,
    });
    try {
      const response = await axios.get(`${this.BASE_URL}?${searchParams}`);
      const data = response.data;
      return data;
    } catch (err) {
      console.warn(err);
    }
  }
  incrementPage() {
    this.page += 1;
  }
}
