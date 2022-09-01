import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '29606139-306393987ee25a09df02ffe92',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 140,
};

export default class ServicePixabayApi {
  constructor() {
    this.inputSearchQuery = '';
    this.pageNamber = 0;
    this.PER_PAGE = 140;
    this.total = 0;
  }

  async getPixabayPhoto() {
    this.addNextPage();
    const { data } = await axios.get(
      `?q=${this.inputSearchQuery}&page=${this.pageNamber}`
    );

    return data;
  }
  get SearchQuery() {
    return this.inputSearchQuery;
  }
  set SearchQuery(newQuwry) {
    this.inputSearchQuery = newQuwry;
  }
  get totalPhoto() {
    return this.total;
  }
  set totalPhoto(newTotal) {
    this.total = newTotal;
  }
  addNextPage() {
    this.pageNamber += 1;
  }

  resetPage() {
    this.pageNamber = 0;
  }
  hasMorePhotos() {
    return this.pageNamber <= this.total / this.PER_PAGE;
  }
}
