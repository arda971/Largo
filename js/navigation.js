(function() {
  var $ = jQuery;

  var LargoNavigation = function() {
    this.scrollTop = $(window).scrollTop();
    this.previousScroll = null;
    return this.init();
  };

  LargoNavigation.prototype.init = function() {
    // Dropdowns on touch screens
    this.enableMobileDropdowns();

    // Stick navigation
    this.stickyNavEl = $('.sticky-nav-holder');
    this.mainEl = $('#main');
    this.stickyNavWaypointOpts = {
      offset: $('#wpadminbar').height() + parseInt(this.mainEl.css('marginTop'))
    };
    this.bindStickyNavEvents();

    // Sticky nav on small viewports
    this.responsiveNavigation();

    return this;
  };

  LargoNavigation.prototype.enableMobileDropdowns = function () {
    // Touch enable the drop-down menus
    if (Modernizr.touch) {
      // iOS Safari works with touchstart, the rest work with click
      var mobileEvent = /Mobile\/.+Safari/.test(navigator.userAgent) ? 'touchstart' : 'click',
      // Open the drop down
      openMenu = false;

      // Handle the tap for the drop down
      $('ul.nav').on(mobileEvent + '.largo', 'li', function(event) {
        var li = $(event.currentTarget);

        if (!li.hasClass('dropdown')) {
          window.location.href = li.find('a').attr('href');
          event.preventDefault();
          event.stopPropagation();
          return false;
        }

        if (!li.is('.open')) {
          // The link when the menu is closed
          closeOpenMenu();
          li.addClass('open');
          openMenu = li;

          event.preventDefault();
          event.stopPropagation();
        } else if ($(event.target).is('b.caret')) {
          // The caret when the menu is open
          li.removeClass('open');
          openMenu = false;

          event.preventDefault();
          event.stopPropagation();
        }
      });

      // Call this to call the open menu
      var closeOpenMenu = function() {
        if (openMenu) {
          openMenu.removeClass('open');
          openMenu = false;
        }
      }

      // Close the open menu when the user taps elsewhere
      $('body').on(mobileEvent, closeOpenMenu);
    }
  };

  LargoNavigation.prototype.bindStickyNavEvents = function() {
    if (this.mainEl.length) {
      this.stickyNavInit();
      $(window).on('resize', this.stickyNavResizeCallback.bind(this));
      $(window).on('scroll', this.stickyNavScrollCallback.bind(this));
    }
  };

  LargoNavigation.prototype.stickyNavInit = function() {
    if ($(window).width() <= 768) {
      this.stickyNavEl.addClass('show');
    }

    // Account for sticky nav with fixed position at top of page
    var stickyNavWrapper = $('.sticky-nav-wrapper');
    if (stickyNavWrapper.length)
      stickyNavWrapper.height(this.stickyNavEl.outerHeight());
  };

  LargoNavigation.prototype.stickyNavResizeCallback = function() {
    if ($(window).width() <= 768) {
      this.stickyNavEl.addClass('show');
    } else {
      if ($(window).scrollTop() <= this.mainEl.offset().top)
        this.stickyNavEl.removeClass('show');
    }
  };

  LargoNavigation.prototype.stickyNavScrollCallback = function(event) {
    var self = this,
        direction = this.scrollDirection(),
        callback, wait;

    if ($(window).width() <= 768) {
      return false;
    }

    if ($(window).scrollTop() <= this.mainEl.offset().top) {
      this.stickyNavEl.removeClass('show');
      clearTimeout(this.scrollTimeout);
      return;
    }

    if (this.previousScroll == direction) {
      return;
    }

    clearTimeout(this.scrollTimeout);

    if (direction == 'up') {
      callback = this.stickyNavEl.addClass.bind(this.stickyNavEl, 'show'),
      wait = 250;
    } else if (direction == 'down') {
      callback = this.stickyNavEl.removeClass.bind(this.stickyNavEl, 'show');
      wait = 500;
    }

    this.scrollTimeout = setTimeout(callback, wait);
    this.previousScroll = direction;
  };

  LargoNavigation.prototype.scrollDirection = function() {
    var scrollTop = $(window).scrollTop(),
        direction;

    if (scrollTop > this.scrollTop)
      direction = 'down';
    else
      direction = 'up';

    this.scrollTop = scrollTop;
    return direction;
  };

  LargoNavigation.prototype.responsiveNavigation = function() {
    // Responsive navigation
    $('.navbar .toggle-nav-bar').each(function() {
      var toggleButton = $(this);
      var navbar = toggleButton.closest('.navbar');

      // Support both touch and click events
      toggleButton.on('touchstart.toggleNav', function() {
        // If it is a touch event, get rid of the click events.
        toggleButton.off('click.toggleNav');
        navbar.toggleClass('open');

        // Close all the open sub navigation upon closing the menu
        if (!navbar.hasClass('open'))
          navbar.find('.nav-shelf li.open').removeClass('open');
      });

      toggleButton.on('click.toggleNav', function() {
        navbar.toggleClass('open');
      });

      // Secondary nav
      navbar.on('touchstart.toggleNav click.toggleNav', '.nav-shelf .caret', function(event) {
        // Only handle when
        if (toggleButton.css('display') == 'none')
          return;

        if (event.type == 'touchstart')
          navbar.off('click.toggleNav', '.nav-shelf .dropdown-toggle');

        var li = $( event.target ).closest('li');

        // Close the others if we are opening
        if (!li.hasClass('open'))
          navbar.find('.nav-shelf li.open').removeClass('open');

        // Open ours
        li.toggleClass('open');
        event.preventDefault();
      });
    });
  };

  if (typeof window.LargoNavigation == 'undefined')
    window.LargoNavigation = LargoNavigation;

  $(document).ready(function() {
    new LargoNavigation();
  });

})();
