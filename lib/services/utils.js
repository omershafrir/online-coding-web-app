export function debounce(cb, delay = 200) {
    let timeout

    return (...args)  => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)  
    }
  }