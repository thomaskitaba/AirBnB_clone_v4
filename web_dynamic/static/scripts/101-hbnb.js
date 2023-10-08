$('document').ready(function () {
    const api = 'http://' + window.location.hostname;

    $.get(api + ':5001/api/v1/status/', function (response) {
        if (response.status === 'OK') {
          $('DIV#api_status').addClass('available');
        } else {
          $('DIV#api_status').removeClass('available');
        }
      });

    $.ajax({
      url: api + ':5001/api/v1/places_search/',
      type: 'POST',
      data: '{}',
      contentType: 'application/json',
      dataType: 'json',
      success: appendPlaces
    });

    let amenities = {};
    $('.amenities INPUT[type="checkbox"]').change(function () {
      if ($(this).is(':checked')) {
        amenities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        delete amenities[$(this).attr('data-id')];
      }
      if (Object.values(amenities).length === 0) {
        $('.amenities H4').html('&nbsp;');
      } else {
        $('.amenities H4').text(Object.values(amenities).join(', '));
      }
    });
    let states = {};
    $('.locations ul h2 INPUT[type="checkbox"]').change(function () {
      if ($(this).is(':checked')) {
        states[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        delete states[$(this).attr('data-id')];
      }
      if (Object.values(states).length === 0) {
        $('.locations H4').html('&nbsp;');
      } else {
        $('.locations H4').text(Object.values(states).join(', '));
      }
    });

    let cities = {};
    $('.locations ul ul li INPUT[type="checkbox"]').change(function () {
      if ($(this).is(':checked')) {
        cities[$(this).attr('data-id')] = $(this).attr('data-name');
      } else {
        delete cities[$(this).attr('data-id')];
      }
      if (Object.values(cities).length === 0) {
        $('.locations H4').html('&nbsp;');
      } else {
        $('.locations H4').text(Object.values(cities).join(', '));
      }
    });


    $('BUTTON').click(function () {
      $.ajax({
        url: api + ':5001/api/v1/places_search/',
        type: 'POST',
        data: JSON.stringify({
            'amenities': Object.keys(amenities),
            'states': Object.keys(states),
            'cities': Object.keys(cities)}),
        contentType: 'application/json',
        dataType: 'json',
        success: appendPlaces
      });
    });
  });

  function appendPlaces (data) {
    $('SECTION.places').empty();
    $('SECTION.places').append(data.map(place => {
      return `<article>
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">${place.price_by_night }</div>
      </div>
      <div class="information">
        <div class="max_guest">${place.max_guest} Guests</div>
            <div class="number_rooms">${place.number_rooms} Bedrooms </div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms </div>
      </div>
          <div class="description">
        ${place.description}
          </div>
    </article>`;

    }));
  }
