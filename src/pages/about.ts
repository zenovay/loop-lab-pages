import { mountTeamCarousel } from '../components/team-carousel'
import { startPage } from '../site'

startPage()

const team = document.getElementById('team')
if (team !== null) mountTeamCarousel(team)
