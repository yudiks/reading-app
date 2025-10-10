import marieCurie from "./passages/marie-curie.json" assert { type: "json" };
import photosynthesis from "./passages/photosynthesis.json" assert { type: "json" };
import tortoiseHare from "./passages/tortoise-hare.json" assert { type: "json" };
import leonardo from "./passages/leonardo.json" assert { type: "json" };
import waterCycle from "./passages/water-cycle.json" assert { type: "json" };
import greatWall from "./passages/great-wall.json" assert { type: "json" };
import riverGuardians from "./passages/river-guardians.json" assert { type: "json" };
import clockworkClub from "./passages/clockwork-club.json" assert { type: "json" };
import mesaSkywatchers from "./passages/mesa-skywatchers.json" assert { type: "json" };
import harrietTubman from "./passages/harriet-tubman.json" assert { type: "json" };
import katherineJohnson from "./passages/katherine-johnson.json" assert { type: "json" };
import smartphoneInnovation from "./passages/smartphone-innovation.json" assert { type: "json" };
import pokemonGoAdventure from "./passages/pokemon-go-adventure.json" assert { type: "json" };
import computerPioneers from "./passages/computer-pioneers.json" assert { type: "json" };
import pythonCodingCamp from "./passages/python-coding-camp.json" assert { type: "json" };
import zeldaSkyIslandLab from "./passages/zelda-sky-island-lab.json" assert { type: "json" };
import zeldaZoneiteResearch from "./passages/zelda-zoneite-research.json" assert { type: "json" };
import zeldaConstructEngineers from "./passages/zelda-construct-engineers.json" assert { type: "json" };
import zeldaWeatherResearch from "./passages/zelda-weather-research.json" assert { type: "json" };
import zeldaDepthsEcology from "./passages/zelda-depths-ecology.json" assert { type: "json" };

const withCovers = passage => ({
  ...passage,
  coverImage: new URL(`../assets/${passage.coverImage.replace(/^assets\//, "")}`, import.meta.url).href
});

const passages = [
  marieCurie,
  photosynthesis,
  tortoiseHare,
  leonardo,
  waterCycle,
  greatWall,
  riverGuardians,
  clockworkClub,
  mesaSkywatchers,
  harrietTubman,
  katherineJohnson,
  smartphoneInnovation,
  pokemonGoAdventure,
  computerPioneers,
  pythonCodingCamp,
  zeldaSkyIslandLab,
  zeldaZoneiteResearch,
  zeldaConstructEngineers,
  zeldaWeatherResearch,
  zeldaDepthsEcology
].map(withCovers);

export default passages;
