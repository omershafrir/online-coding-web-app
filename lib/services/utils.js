export function debounce(cb, delay) {
    let timeout

    return (...args)  => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)  
    }
  }


  export function throttle(cb, delay){
    let shouldWait , waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null){
            shouldWait = false
        }
        else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc , delay)
        }
    }

    return (...args) => {
        if (shouldWait){
            waitingArgs = args
            return
        }

        cb(...args)
        shouldWait = true

        setTimeout(timeoutFunc , delay)
    }

  }