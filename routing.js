// import filesystem api
const output = require ('fs');

// import sorting helper function
const sortByDistance = require ('./distance_util');
const partners = require ('./partners.json'); // import partners array

for (let n = 1; n < 5; n++) {
  // import each orders file
  const orders = require (`./orders${n}.json`);
  // designate routings output file for corresponding orders file
  const outputFile = `./output${n}.txt`;
  const answer = {};
  
  for (let i = 0; i < partners.length; i++) {
    const partner = partners[i];

    // track each partner's capacity at the front of their corresponding orders array
    answer[partner.id] = [partner.capacity];
  }
  
  for (let j = 0; j < orders.length; j++) {
    const order = orders[j];
    if (order.deliverability !== 'deliverable') continue;
  
    // filter partners array to only include partners who support the order's resource & type
    const capablePartners = partners.filter(partner => {
      return partner.resource === order.resource && partner.type.includes(order.type);
    });
    
    if (capablePartners.length < 2) {
      // if there is only 1 capable partner, it wins the order
      const winner = capablePartners[0].id;
      answer[winner].push(order.id);
      answer[winner][0] -= 1;
    } else {
      // else we sort all capable partners by distance from the order's address
      const destination = order.address;
      const partnersArray = [...capablePartners]; // copy of capablePartners array for sorting
      // helper function to sort array by distance
      const partnersSortedByDistance = sortByDistance(partnersArray, destination);
  
      // iterate over partners array sorted by distance
      for (let k = 0; k < partnersSortedByDistance.length; k++) {
        const potential = partnersSortedByDistance[k].id;
  
        // if the partner has capacity, it wins the order and we break out of the loop
        if (answer[potential][0] > 0) {
          answer[potential].push(order.id);
          answer[potential][0] -= 1;
          break;
        }
      }
    }
  }

  // create output file
  output.writeFile(outputFile, "", function (err) {
    if (err) console.log(err);
  
    console.log("File created!");
  });
  
  const answerKeys = Object.keys(answer);
  
  // iterate over the answer object's keys, and populate output file such that
  // partner id is printed first, then its orders are printed on a new line below
  answerKeys.forEach(key => {
    output.appendFileSync(outputFile, key + "\n");
  
    for (let l = 1; l < answer[key].length; l++) {
      const newLine = answer[key][l];
      output.appendFileSync(outputFile, newLine + "\n");
    }
  });
}


