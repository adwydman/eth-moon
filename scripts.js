{
  const calculatePriceMultiplier = (maxDollarRange) => {
    return 100 / maxDollarRange;
  };

  const menu = document.querySelector('.menu');
  const main = document.querySelector('main');
  const background = document.querySelector('.background');
  const textContainer = document.querySelector('.text-container');
  const closeIcon = document.querySelector('.close-icon');
  const currentPriceWrapper = document.querySelector('.current-price-wrapper');
  const currentPrice = document.querySelector('.current-price');
  const yourMoonWrapper = document.querySelector('.your-moon-wrapper');
  const yourMoon = document.querySelector('.your-moon');
  const moonIcon = document.querySelector('.moon-icon');
  const progressBar = document.querySelector('.progress-bar');
  const maxDollarRange = document.querySelector('.max-dollar-range');
  const up = document.querySelector('.up');
  const down = document.querySelector('.down');
  const saveIcon = document.querySelector('.save-icon');
  const checkIcon = document.querySelector('.check-icon');
  const didEthereumMoon = document.querySelector('.did-dogecoin-moon');
  const whatIsDogecoin = document.querySelector('#what-is-dogecoin');
  const whatIsMoon = document.querySelector('#what-is-moon');
  const donate = document.querySelector('#support');
  const contentElement = document.querySelector('.content');
  const percentToMoon = document.querySelector('.percent-to-moon');
  const yourMoonWrapperChevronDown = document.querySelector('.your-moon-wrapper-chevron-down');
  const sliderElement = document.querySelector('.slider')
  const textElement = document.querySelector('.text')
  const yourMoonLabel = document.querySelector('.your-moon-label');
  const loadingContainer = document.querySelector('.loading');
  const mainWrapper = document.querySelector('.main-wrapper');

  let maxWidth;
  let sliderX = 0;
  let mouseDown = false;
  let isMobile = false;
  let mouseX = 0;
  let currentDollarRange = 5000;
  let currentPriceMultiplier = calculatePriceMultiplier(currentDollarRange);
  let ethereumPrice;
  let yourMoonPrice = null

  progressBar.style.width = 0;

  const parseYourMoonPrice = (moonPrice) => {
    yourMoonPrice = moonPrice;
    if (yourMoonPrice < 0) {
      yourMoonPrice = 0;
    }
    if (yourMoonPrice > currentDollarRange) {
      yourMoonPrice = currentDollarRange;
    }
  }

  const percentToMoonHandler = (moonPrice) => {
    const percentToMoonValue = ethereumPrice * 100 / moonPrice;
  
    if (percentToMoonValue < 100) {
      percentToMoon.style.display = 'block';
      percentToMoon.textContent = `${parseInt(percentToMoonValue)}%`;
      document.title = `$${parseFloat(ethereumPrice).toFixed(2)} - ${parseInt(percentToMoonValue)}% towards Moon!`
    }
    else {
      percentToMoon.style.display = 'none';
      document.title = `$${parseFloat(ethereumPrice).toFixed(2)} - Eth is mooning!`
    }
  };

  let stoppedAtLeft = null;
  let stoppedAtRight = null;

  const setYourMoon = (sliderX, deltaX, clientX) => {
    let sliderPercentage = sliderX * 100 / maxWidth;
    if (sliderPercentage < 0) {
      sliderPercentage = 0;
    }
    else if (sliderPercentage > 100) {
      sliderPercentage = 100;
    }

    if (isMobile) {
      const elementSize = yourMoonWrapper.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      if (deltaX < 0) {
        if (!stoppedAtRight && elementSize.left > 6) {
          yourMoonWrapper.style.left = `${sliderPercentage}%`;
        } else {
          if (!stoppedAtLeft && !stoppedAtRight) {
            stoppedAtLeft = clientX;
          }
        }

        if (stoppedAtRight !== null && stoppedAtRight > clientX && clientX > 0 && clientX < viewportWidth) {
          stoppedAtRight = null;
          yourMoonWrapper.style.left = `${sliderPercentage}%`;
        }
      }


      if (deltaX > 0) {
        if (!stoppedAtLeft && elementSize.right + 6 < viewportWidth) {
          yourMoonWrapper.style.left = `${sliderPercentage}%`;
        } else {
          if (!stoppedAtRight && !stoppedAtLeft) {
            stoppedAtRight = clientX;
          }
        }


        if (stoppedAtLeft !== null && stoppedAtLeft < clientX && clientX > 0 && clientX < viewportWidth) {
          stoppedAtLeft = null;
          yourMoonWrapper.style.left = `${sliderPercentage}%`;
        }
      }
    } else {
      yourMoonWrapper.style.left = `${sliderPercentage}%`;
    }

    moonIcon.style.left = `${sliderPercentage}%`
    yourMoonWrapperChevronDown.style.left = `${sliderPercentage}%`;
  };

  const ethereumMoonHandler = (moonPrice, ethereumPrice) => {
    if (moonPrice > ethereumPrice) {
      didEthereumMoon.innerHTML = 'ETH DID <span class="not">NOT</span> MOON';
    } else {
      didEthereumMoon.innerHTML = 'ETH IS MOONING!';
    }
  }

  const getEthereumPrice = (initialLoad) => {
    return fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then((response) => response.json())
    .then((result) => {
      ethereumPrice = result.ethereum.usd;
      // localStorage.setItem('ethereumPrice', ethereumPrice);
  
      currentPrice.textContent = `$${parseFloat(ethereumPrice).toFixed(2)}`;
      currentPriceWrapper.style.left = `${ethereumPrice * currentPriceMultiplier}%`
      progressBar.style.width = `${ethereumPrice * currentPriceMultiplier}%`;
  
      if (!yourMoonPrice) {
        yourMoonPrice = localStorage.getItem('yourMoon') || parseFloat(4000).toFixed(2);
      }

      if (initialLoad) {
        while(ethereumPrice / currentDollarRange > 0.8) {
          onPriceControlClick(1);
        }
      }
  
      percentToMoonHandler(yourMoonPrice);
      ethereumMoonHandler(yourMoonPrice, ethereumPrice);
    });
  }

  setInterval(() => {
    getEthereumPrice()
  }, 2000)


  menu.addEventListener('click', (event) => {
    if (event.target.innerText !== 'More data') {
      main.classList.add('zoom-out');
      background.classList.add('content-blur');
      textContainer.classList.add('appear');

      if (event.target.innerText === 'DogeCoin?') {
        whatIsDogecoin.style.display = 'block';
      }
      if (event.target.innerText === 'Moon?') {
        whatIsMoon.style.display = 'block';
      }
      if (event.target.innerText === 'Donate') {
        donate.style.display = 'block';
      }
    }
  });

  closeIcon.addEventListener('click', () => {
    textContainer.classList.add('reverse-appear');
    textContainer.classList.remove('appear');
    main.classList.add('reverse-zoom-out');
    main.classList.remove('zoom-out');
    background.classList.remove('content-blur');
    background.classList.add('reverse-content-blur');
    whatIsDogecoin.style.display = 'none';
    whatIsMoon.style.display = 'none';
    donate.style.display = 'none';
  })

  window.addEventListener('load', function() {
    getEthereumPrice(true)
      .then(() => {
        loadingContainer.classList.add('zoom-out')
        mainWrapper.classList.add('fade-in');

        const moonPrice = localStorage.getItem('yourMoon') || parseFloat(4000).toFixed(2);
        ethereumPrice = localStorage.getItem('ethereumPrice');
        currentDollarRange = parseFloat(localStorage.getItem('dollarRange')) || 5000;
        currentPriceMultiplier = calculatePriceMultiplier(currentDollarRange)
    
        maxDollarRange.textContent = `$${parseFloat(currentDollarRange)}`;
    
        yourMoon.textContent = `$${moonPrice}`;
        if (ethereumPrice) {
          progressBar.style.width = `${ethereumPrice * currentPriceMultiplier}%`;
          currentPrice.textContent = `$${parseFloat(ethereumPrice).toFixed(2) }`;
          currentPriceWrapper.style.left = `${ethereumPrice * currentPriceMultiplier}%`
          percentToMoonHandler(moonPrice);
        }
    
        if (currentDollarRange === 5000) {
          down.style.display = 'none';
        }
        ethereumMoonHandler(moonPrice, ethereumPrice);
    
        setTimeout(() => {
          textElement.classList.add('fade-in');
        }, 500);
        
        setTimeout(() => {
          contentElement.classList.add('open-up');
          maxWidth = sliderElement.getBoundingClientRect().width;
          if (moonPrice > 0) {
            sliderX = moonPrice * maxWidth * currentPriceMultiplier / 100
          }
          setYourMoon(sliderX);
        }, 1000);
      })
  })

  const progressDragMobile = function(event) {
    if (!mouseDown){return};
    
    progressDrag(event.touches[0].clientX)
  }

  const progressDragBrowser = function(event) {
    if (!mouseDown || isMobile) {return}
    event.preventDefault();
    progressDrag(event.clientX);
  }

  const progressDrag = (clientX) => {
    var deltaX = clientX - mouseX;
    mouseX = clientX;
    sliderX += deltaX;

    const progressMoved = sliderX / maxWidth;

    const moonPrice = parseFloat(progressMoved * currentDollarRange).toFixed(2);

    setYourMoon(sliderX, deltaX, clientX);
    parseYourMoonPrice(moonPrice);

    if (yourMoonPrice !== localStorage.getItem('yourMoon')) {
      saveIcon.style.display = 'block';
    }

    yourMoon.textContent = `$${yourMoonPrice}`;

    percentToMoonHandler(yourMoonPrice);

    checkIcon.classList.remove('check-icon-appear');
    
    ethereumMoonHandler(yourMoonPrice, ethereumPrice);
  }

  const dragEndMobile = (event) => {
    mouseDown = false;
    isMobile = false;

    dragEnd();
  };

  const dragEndBrowser = (event) => {
    event.preventDefault();
    mouseDown = false;

    dragEnd();
  };

  const dragEnd = () => {
    if (sliderX < 0) {
      sliderX = 0;
    }
    if (sliderX > maxWidth) {
      sliderX = maxWidth
    }

    const progressMoved = sliderX / maxWidth;
    const moonPrice = parseFloat(progressMoved * currentDollarRange).toFixed(2);
    parseYourMoonPrice(moonPrice);
  };

  moonIcon.addEventListener('touchstart', (event) => {
    isMobile = true;
    mouseDown = true;
    mouseX = event.touches[0].clientX;
  });

  moonIcon.addEventListener('mousedown', (evt) => {
    evt.preventDefault();
    mouseDown = true;
    mouseX = evt.clientX;
  });

  moonIcon.addEventListener('mousemove', progressDragBrowser);

  moonIcon.addEventListener('touchmove', progressDragMobile);

  moonIcon.addEventListener('mouseup', dragEndBrowser);

  moonIcon.addEventListener('touchstop', dragEndMobile);

  moonIcon.addEventListener('mouseover', () => {
    yourMoonLabel.innerHTML = 'Drag to set your moon:';
  });

  moonIcon.addEventListener('mouseout', () => {
    yourMoonLabel.innerHTML = 'Your moon:';
  });

  document.addEventListener('mousemove', progressDragBrowser);

  document.addEventListener('mouseup', dragEndBrowser);

  up.addEventListener('click', () => {
    onPriceControlClick(1);

    if (currentDollarRange > 5000) {
      down.style.display = 'block';
    }
  });

  down.addEventListener('click', () => {
    onPriceControlClick(-1);

    if (currentDollarRange === 5000) {
      down.style.display = 'none';
    }
  });

  saveIcon.addEventListener('click', () => {
    const progressMoved = sliderX / maxWidth;
    const moonPrice = parseFloat(progressMoved * currentDollarRange).toFixed(2);

    parseYourMoonPrice(moonPrice);
    localStorage.setItem('yourMoon', yourMoonPrice);
    localStorage.setItem('dollarRange', currentDollarRange);

    saveIcon.style.display = 'none';
    checkIcon.classList.add('check-icon-appear');
  });

  const onPriceControlClick = (direction) => {
    currentDollarRange += 5000 * direction;

    sliderX = (sliderX * (currentDollarRange + 5000 * (-direction))) / (currentDollarRange);

    if (sliderX > maxWidth) {
      sliderX = maxWidth;
    }

    let moonProgress = sliderX * 100 / maxWidth;

    currentPriceMultiplier = calculatePriceMultiplier(currentDollarRange);

    maxDollarRange.textContent = `$${parseFloat(currentDollarRange)}`
    currentPriceWrapper.style.left = `${ethereumPrice * currentPriceMultiplier}%`
    yourMoonWrapper.style.left = `${moonProgress}%`;
    moonIcon.style.left = `${moonProgress}%`;
    yourMoonWrapperChevronDown.style.left = `${moonProgress}%`;
    progressBar.style.width = `${ethereumPrice * currentPriceMultiplier}%`;
  };
}