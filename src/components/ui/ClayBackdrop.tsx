import {
  ClayBlob,
  ClayCv,
  ClayFolder,
  ClayLeaf,
  ClayMagnifier,
  ClayProfile,
} from "./ClayArt";

export type BackdropVariant =
  | "landing" // soft landing: blobs in the corners
  | "floating" // floating recruitment illustrations
  | "garden" // leaves and flowers
  | "corner"; // two small illustrations in the corners

/**
 * Decorative layer. Put it inside a `relative overflow-hidden` (or `isolate`)
 * wrapper and keep the real content in a `relative z-10` sibling so it never
 * blocks reading or clicking.
 */
export default function ClayBackdrop({ variant = "landing" }: { variant?: BackdropVariant }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {variant === "landing" && (
        <>
          <ClayBlob tone="pink" className="absolute -left-16 -top-16 h-56 w-56 opacity-70" />
          <ClayBlob tone="green" className="absolute -bottom-20 -right-12 h-64 w-64 opacity-70" />
          <ClayBlob tone="cream" className="absolute right-[12%] top-10 hidden h-16 w-16 opacity-80 md:block" />
        </>
      )}

      {variant === "floating" && (
        <>
          <ClayProfile className="absolute left-[6%] top-[10%] hidden h-24 w-24 -rotate-6 opacity-95 md:block" />
          <ClayCv className="absolute right-[7%] top-[8%] hidden h-32 w-32 rotate-6 md:block" />
          <ClayMagnifier className="absolute bottom-[9%] left-[8%] hidden h-28 w-28 md:block" />
          <ClayFolder className="absolute bottom-[8%] right-[8%] hidden h-28 w-28 -rotate-3 md:block" />
          <ClayBlob tone="pink" className="absolute -left-10 bottom-1/3 h-28 w-28 opacity-50" />
          <ClayBlob tone="green" className="absolute -right-8 top-1/3 h-24 w-24 opacity-50" />
        </>
      )}

      {variant === "garden" && (
        <>
          <ClayLeaf className="absolute -left-2 bottom-0 h-32 w-32 opacity-90" />
          <ClayLeaf className="absolute -right-2 top-4 h-24 w-24 -scale-x-100 opacity-80" />
        </>
      )}

      {variant === "corner" && (
        <>
          <ClayCv className="absolute -right-2 -top-2 hidden h-24 w-24 rotate-6 opacity-90 md:block" />
          <ClayMagnifier className="absolute -bottom-2 -left-2 hidden h-24 w-24 opacity-90 md:block" />
        </>
      )}
    </div>
  );
}
