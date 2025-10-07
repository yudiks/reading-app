import marieCurie from "./passages/marie-curie.json" assert { type: "json" };
import photosynthesis from "./passages/photosynthesis.json" assert { type: "json" };
import tortoiseHare from "./passages/tortoise-hare.json" assert { type: "json" };
import leonardo from "./passages/leonardo.json" assert { type: "json" };
import waterCycle from "./passages/water-cycle.json" assert { type: "json" };
import greatWall from "./passages/great-wall.json" assert { type: "json" };
import riverGuardians from "./passages/river-guardians.json" assert { type: "json" };
import clockworkClub from "./passages/clockwork-club.json" assert { type: "json" };
import mesaSkywatchers from "./passages/mesa-skywatchers.json" assert { type: "json" };

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
  mesaSkywatchers
].map(withCovers);

export default passages;
