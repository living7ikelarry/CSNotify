import t from 'tcomb-form-native'

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
  '1819 Innovation Hub': '1819 Innovation Hub',
  'Lot 16': 'Lot 16',
  'Lot 22': 'Lot 22'

}, 'ParkingLocs');

export const RecLoc = t.enums({
  'CRC': 'CRC',
  'Care/Crawley': 'Care/Crawley'
}, 'RecLocs');

export const Department = t.enums({
  'Bearcat Card': 'Bearcat Card',
  'Campus Recreation': 'Campus Recreation',
  'Parking': 'Parking',
  'Vending': 'Vending'

}, 'Department');
