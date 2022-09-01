import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '29606139-306393987ee25a09df02ffe92',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 150,
};

export default class ServicePixabayApi {
  constructor() {
    this.inputSearchQuery = '';
    this.pageNamber = 1;
    this.PER_PAGE = 150;
    this.total = 0;
  }

  async getPixabayPhoto() {
    const { data } = await axios.get(
      `?q=${this.inputSearchQuery}&page=${this.pageNamber}`
    );

    this.addNextPage();
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
    this.pageNamber = 1;
  }
  hasMorePhotos() {
    return this.pageNamber <= this.total / this.PER_PAGE - 1;
  }
}
