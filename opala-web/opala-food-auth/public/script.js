import { handleItems } from "./handleItems.mjs";
import { toggleMenu } from "./toggleMenu.mjs";

function handleLogout() {
  const logout = document.getElementById('logout')
  logout.addEventListener('click', () => {
    Cookies.remove('authorization')
    window.location.href = '/login'
  })
}

function main() {
  toggleMenu()
  handleItems()
  handleLogout()
}

main()