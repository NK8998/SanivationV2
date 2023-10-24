
export function getDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    
    let yyyy = today.getFullYear();
    
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
   
    return dd + '-' + mm + '-' + yyyy;
  }


export function getCurrentMonthAndYear() {
const now = new Date();
const year = now.getFullYear();
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const month = monthNames[now.getMonth()];

return { year, month };
}