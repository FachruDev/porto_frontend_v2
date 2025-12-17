import type { ClientLoaderFunction } from "react-router";
import { redirect } from "react-router";

export const clientLoader: ClientLoaderFunction = () => {
  throw redirect("/admin/heroes");
};

export default function AdminIndex() {
  return null;
}
