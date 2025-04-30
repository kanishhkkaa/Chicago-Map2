const dealerships = [
    {
        name: "Chicago Honda Center",
        lat: 41.8781,
        lng: -87.6298,
        address: "123 W Lake St, Chicago, IL",
        phone: "(312) 555-1234",
        rating: 4.5,
        review: "Great customer service and deals!"
    },
    {
        name: "Windy City Honda",
        lat: 41.8818,
        lng: -87.6232,
        address: "456 Michigan Ave, Chicago, IL",
        phone: "(312) 555-5678",
        rating: 4.2,
        review: "Quick service and friendly staff."
    },
    {
        name: "Lakeview Honda",
        lat: 41.9417,
        lng: -87.6536,
        address: "789 N Clark St, Chicago, IL",
        phone: "(773) 555-9101",
        rating: 4.7,
        review: "Best Honda deals in the city!"
    }
];


let map;
let markers = [];

function initMap() {
    const chicago = { lat: 41.8781, lng: -87.6298 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: chicago,
    });

    renderDealerships(dealerships);
    document.getElementById("search-input").addEventListener("input", (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = dealerships.filter(d =>
            d.name.toLowerCase().includes(keyword)
        );
        renderDealerships(filtered);

    });

    document.getElementById("sort-options").addEventListener("change", (e) => {
    const sortType = e.target.value;
    applySort(sortType);
});
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: "You are here!",
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });

            map.setCenter(userLocation);
            highlightNearestDealership(userLocation);
        });
    }
}

function renderDealerships(listData) {
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const list = document.getElementById("dealerships");
    list.innerHTML = "";

    listData.forEach((dealer, index) => {
        const marker = new google.maps.Marker({
            position: { lat: dealer.lat, lng: dealer.lng },
            map: map,
            title: dealer.name,
        });
        markers.push(marker);

        const li = document.createElement("li");
        li.innerHTML = `
    <h3><i class="fas fa-car"></i> ${dealer.name}</h3>
    <p><i class="fas fa-location-dot"></i> ${dealer.address}</p>
    <p><i class="fas fa-phone"></i> ${dealer.phone}</p>
    <p>${getStars(dealer.rating)}</p>
    <p><em>"${dealer.review}"</em></p>
    <a href="https://www.google.com/maps/dir/?api=1&destination=${dealer.lat},${dealer.lng}" target="_blank">
        <i class="fas fa-map-pin"></i> Get Directions
    </a>
`;

        list.appendChild(li);
    });
}

function getStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star" style="color: #f39c12;"></i> ';
    }

    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt" style="color: #f39c12;"></i> ';
    }


    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star" style="color: #f39c12;"></i> ';
    }

    return stars + `<strong>(${rating})</strong>`;
}


function highlightNearest(userLocation) {
    let distances = dealerships.map((dealer, index) => {
        return {
            ...dealer,
            distance: getDistance(userLocation, { lat: dealer.lat, lng: dealer.lng }),
            originalIndex: index // Track original index
        };
    });
    distances.sort((a, b) => a.distance - b.distance);
    if (markers[distances[0].originalIndex]) {
        markers[distances[0].originalIndex].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
        markers[distances[0].originalIndex].setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => markers[distances[0].originalIndex].setAnimation(null), 2500);
    }
    renderSortedDealerships(distances);
}



function renderSortedDealerships(sortedList) {
  
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const list = document.getElementById("dealerships");
    list.innerHTML = "";

    sortedList.forEach((dealer, index) => {
        const marker = new google.maps.Marker({
            position: { lat: dealer.lat, lng: dealer.lng },
            map: map,
            title: dealer.name,
        });
        markers.push(marker);

        const li = document.createElement("li");
        li.innerHTML = `
            <h3><i class="fas fa-car"></i> ${dealer.name}</h3>
            <p><i class="fas fa-location-dot"></i> ${dealer.address}</p>
            <p><i class="fas fa-phone"></i> ${dealer.phone}</p>
            <p>${getStars(dealer.rating)}</p>
            <p><em>"${dealer.review}"</em></p>
            <p><strong>Distance:</strong> ${dealer.distance.toFixed(2)} km</p>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${dealer.lat},${dealer.lng}" target="_blank">
                <i class="fas fa-map-pin"></i> Get Directions
            </a>
        `;
        list.appendChild(li);
    });
}

function applySort(sortType) {
    let sortedDealers = [...dealerships]; // Copy array

    if (sortType === "distance") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                sortedDealers = sortedDealers.map((dealer) => ({
                    ...dealer,
                    distance: getDistance(userLocation, { lat: dealer.lat, lng: dealer.lng })
                }));
                sortedDealers.sort((a, b) => a.distance - b.distance);
                renderSortedDealerships(sortedDealers);
            });
        }
    } else if (sortType === "name") {
        sortedDealers.sort((a, b) => a.name.localeCompare(b.name));
        renderDealerships(sortedDealers);
    } else if (sortType === "rating") {
        sortedDealers.sort((a, b) => b.rating - a.rating);
        renderDealerships(sortedDealers);
    }
}


function getDistance(coord1, coord2) {
    const R = 6371; // km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(deg) {
    return deg * Math.PI / 180;
}
(function loadGoogleMaps() {
    const apiKey = 'AIzaSyDvnqyKvHMp8zO2CAgZVGfHji7qH9X_gIc';
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
})();
document.getElementById("toggle-button").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});
fetch('http://localhost:5000/api/dealerships')
  .then(res => res.json())
  .then(data => {
    console.log(data); // Show MongoDB data
  })
  .catch(err => console.error(err));

   // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCpEt4-hvsOdxURoPI8Gd3yKnYvg1w0oXk&callback=initMap`;
  // AIzaSyAU6zOS7KAiVaSkGeTUuHRwNd0L-IFWUNk
  //new API key=  AIzaSyDvnqyKvHMp8zO2CAgZVGfHji7qH9X_gIc'
  //`https://maps.googleapis.com/maps/api/js?key=AIzaSyDvnqyKvHMp8zO2CAgZVGfHji7qH9X_gIc&callback=initMap`
