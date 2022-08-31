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
    this.pageNamber = 1;
    this.PER_PAGE = 140;
  }

  getPixabayPhoto() {
    return axios
      .get(`?q=${this.inputSearchQuery}&page=${this.pageNamber}`)
      .then(response => {
        return response;
      })
      .then(data => {
        this.addNextPage();
        return data;
      });
  }
  get SearchQuery() {
    return this.inputSearchQuery;
  }
  set SearchQuery(newQuwry) {
    this.inputSearchQuery = newQuwry;
  }
  addNextPage() {
    this.pageNamber += 1;
  }

  resetPage() {
    this.pageNamber = 1;
  }
}
