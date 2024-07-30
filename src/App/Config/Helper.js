import moment from 'moment';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'

class Helper {
  static localhost = '127.0.0.1:8000';
  static server = 'api.cyberify.co';
  static basePath = `//${this.server}`;
  static apiUrl = `${this.basePath}/api/`;
  static openaiAPI = "sk-proj-Afwl98CcR91OEunAqSWxT3BlbkFJs8mB1GJeNXTKkwz8BK6D";

  static authUser = JSON.parse(localStorage.getItem('user')) ?? {};

  static serverImage = (name) => {
    return `${this.basePath}/uploads/${name}`;
  }

  static authHeaders = {
    headers: {
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  }

  static authFileHeaders = {
    headers: {
      "Content-Type": 'multipart/form-data',
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  }

  static getItem = (data, isJson = false) => {
    if (isJson) {
      return JSON.parse(localStorage.getItem(data));
    } else {
      return localStorage.getItem(data);
    }
  }

  static setItem = (key, data, isJson = false) => {
    if (isJson) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, data);
    }
  }

  static toast = (type, message) => {
    const notyf = new Notyf();
    notyf.open({
      message: message,
      type: type,
      position: { x: 'right', y: 'top' },
      ripple: true,
      dismissible: true,
      duration: 2000,
    });
  }

  static staticImage(path) {
    const imageUrl = new URL(`/src/${path}`, import.meta.url).href;
    return imageUrl;
  }

  static replaceSpaces(str) {
    return str.replace(/ /g, '-');
  }

  static loadScript(scriptName, dashboard = false) {
    return new Promise((resolve, reject) => {
      const scriptPath = new URL(`/src/assets/${scriptName}`, import.meta.url).href;
      const script = document.createElement('script');
      script.src = scriptPath;
      script.async = true;

      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Script load error: ${scriptPath}`));

      document.body.appendChild(script);
    });
  }

  static convertOption(snakeCaseStr) {
    if (snakeCaseStr) {
      // Split the string by underscores
      let words = snakeCaseStr.split('_');

      // Convert each word to title case (first letter uppercase, rest lowercase)
      let titleCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());

      // Join the title case words with a space
      return titleCaseWords.join(' ');
    }
    return "";
  }

  static makeOptions(data, isObject = false, label = "", value = "", add_all = false, all_label = 'All') {
    let options = [];
    if (isObject) {
      if(add_all){
        options.push({
          label: all_label,
          value: 'all'
        });
      }
      data.forEach(record => {
        let option = {
          label: record[label],
          value: record[value],
        };
        options.push(option);
      });
    } else {
      data.forEach(record => {
        let option = {
          label: record,
          value: record,
        };
        options.push(option);
      });
    }
    return options;
  }

  static getStatusColor(status) {
    const statusColors = {
      'not_started': '#B0B0B0',
      'in_progress': '#007BFF',
      'in_review': '#FFA500',
      'on_hold': '#FFD700',
      'delayed': '#FF4500',
      'cancelled': '#8B0000',
      'approved': '#28A745',
      'rejected': '#6C757D',
      'completed': '#6F42C1'
    };

    return statusColors[status] || '#000000';
  }

  static getPriorityColor(priority) {
    const priorityColors = {
      'low': '#006400',
      'medium': '#483D8B',
      'high': '#FF8C00',
      'urgent': '#8B0000',
      'critical': '#800000'
    };

    return priorityColors[priority] || '#000000';
  }

  static getBiddingStatusColor(status) {
    const statusColors = {
      'Submitted': '#1E40AF', // Dark Blue
      'Viewed': '#CA8A04', // Dark Yellow
      'Inbox': '#15803D', // Dark Green
      'Job Closed': '#B91C1C', // Dark Red
      'Contracted': '#6D28D9' // Dark Purple
    };
  
    return statusColors[status] || '#000000'; // Default to black if status not found
  }  

  static isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  static daysDiff(dueDate, completedDate) {
    const due = moment(dueDate);
    const completed = moment(completedDate);
    const daysDifference = completed.diff(due, 'days');

    return `${Math.abs(daysDifference)} Days ${daysDifference < 0 ? 'Before' : 'After'}`;
  }

  static search = (query, data, fields) => {
    if(query){
        // eslint-disable-next-line
        let filteredData = data.filter(row => {
            for(let i = 0; i < fields.length; i++){
                let field = fields[i];
                if(field.includes(".")){
                    let keyvalue = field.split(".");
                    let key = keyvalue[0];
                    let value = keyvalue[1];
                    if(isNaN(query) && isNaN(row[key][value])){
                        if(row[key][value].toLowerCase().includes(query.toLowerCase())){
                            return row;
                        }
                    }else if(!isNaN(query) && !isNaN(row[key][value])){
                        if(row[key][value].toString().includes(query)){
                            return row;
                        }
                    }
                }else{
                    if(isNaN(query) && isNaN(row[field])){
                        if(row[field].toLowerCase().includes(query.toLowerCase())){
                            return row;
                        }
                    }else if(!isNaN(query) && !isNaN(row[field])){
                        if(row[field].toString().includes(query)){
                            return row;
                        }
                    }
                }
            }
        });
        return filteredData;
    }else{
        return data;
    }
  }

  static paginate = (data, perPage = 10) => {
    let input = data;
    let chunked = []
    let size = perPage;

    Array.from({length: Math.ceil(input.length / size)}, (val, i) => {
        chunked.push(input.slice(i * size, i * size + size))
    });

    return chunked;
  }
}

export default Helper;