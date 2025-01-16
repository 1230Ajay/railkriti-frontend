export class Cookie{
    
    async isAuthenticated(){
        if (document.cookie.includes('jwt=')) {
            console.log('Cookie exists!');
            return true
          } else {
            console.log('Cookie not found.');
            return false
          }
    }
}