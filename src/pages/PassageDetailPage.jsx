import { useParams } from "react-router-dom";
import { usePassageById } from "../utils/usePassages.js";
import PassageDetail from "../components/PassageDetail.jsx";

export default function PassageDetailPage() {
  const { id } = useParams();
  const passage = usePassageById(id);

  return <PassageDetail passage={passage} />;
}
