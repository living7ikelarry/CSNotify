import t from 'tcomb-form-native'

export const Department = t.enums({
  'Bearcat Card': 'Bearcat Card',
  'Campus Recreation': 'Campus Recreation',
  'Parking': 'Parking',
  'Vending': 'Vending',
  'Food Services' : 'Food Services',
  'CES' : 'CES'

}, 'Department');

export const ParkingLoc = t.enums({
  'CCM': 'CCM',
  'Calhoun': 'Calhoun',
  'Campus Green': 'Campus Green',
  'Clifton Court': 'Clifton Court',
  'Corry': 'Corry',
  'Stratford Heights': 'Stratford Heights',
  'University Avenue': 'University Avenue',
  'Varsity Village': 'Varsity Village',
  'Woodside Avenue': 'Woodside Avenue',
  'Eden': 'Eden',
  'Kingsgate/University Hall': 'Kingsgate/University Hall',
  'Other': 'Other'

}, 'ParkingLocs');

export const RecLoc = t.enums({
  'CRC': 'CRC',
  'Care/Crawley': 'Care/Crawley'
}, 'RecLocs');

export const FoodLoc = t.enums({
  '1819 Starbucks Kiosk' : '1819 Starbucks Kiosk',
  'Bleecker St @ UC Blue Ash' : 'Bleecker St @ UC Blue Ash',
  'Burger King' : 'Burger King',
  'Campus View Cafe' : 'Campus View Cafe',
  'Catskeller' : 'Catskeller',
  'CenterCourt' : 'CenterCourt',
  'Chick-fil-A' : 'Chick-fil-A',
  'Classic Fare Catering' : 'Classic Fare Catering',
  'College of Business Cafe' : 'College of Business Cafe',
  'DAAP Cafe' : 'DAAP Cafe',
  'Greens to Go' : 'Greens to Go',
  'MarketPointe' : 'MarketPointe',
  'Mick & Macks Cafe' : 'Mick & Macks Cafe',
  'OTG (On the Green)' : 'OTG (On the Green)',
  'Quick Micks' : 'Quick Micks',
  'Stadium View Cafe' : 'Stadium View Cafe',
  'Starbucks - CCM' : 'Starbucks - CCM',
  'Starbucks - Library' : 'Starbucks - Library',
  'Starbucks - MSB': 'Starbucks - MSB',
  'Starbucks - SSLC' : 'Starbucks - SSLC',
  'Subway - CARE/Crawley' : 'Subway - CARE/Crawley',
  'Subway - SSLC' : 'Subway - SSLC',
  'Taco Bell' : 'Taco Bell',
  'Teachers Cafe' : 'Teachers Cafe',
  'Tim Hortons' : 'Tim Hortons',
  'TUC Pizza Location' : 'TUC Pizza Location',
  'Varsity Club' : 'Varsity Club',
  'Victory Parkway Cafe' : 'Victory Parkway Cafe'

}, 'FoodLocs');

export const CESLoc = t.enums({
  'TUC' : 'TUC',
  'SSLC' : 'SSLC',
  'West Pavilion' : 'West Pavilion',
  'Kingsgate' : 'Kingsgate'
});
