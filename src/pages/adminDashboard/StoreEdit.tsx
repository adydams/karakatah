import { useParams } from "react-router";

export default function StoreEdit() {
  const params = useParams();
  console.log(params);

  const storeId = params.storeId;
  console.log(storeId);

  return <div>StoreEdit</div>;
}
