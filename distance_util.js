function calcDistance (origin, destination) {
  let distance = Math.sqrt(
    Math.pow((origin.latitude - destination.latitude), 2)
    + Math.pow((origin.longitude - destination.longitude), 2)
  );

  return distance;
}


function sortByDistance (partners, deliveryAddress) {
  partners.sort((a, b) => {
    const distanceA = calcDistance(a.address, deliveryAddress);
    const distanceB = calcDistance(b.address, deliveryAddress);

    if (distanceA < distanceB) return -1;
    if (distanceA === distanceB) return 0;
    if (distanceA > distanceB) return 1;
  });

  return partners;
}

module.exports = sortByDistance;