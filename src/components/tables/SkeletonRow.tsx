const SkeletonRow = ({ skeletonCount }: { skeletonCount: number }) => (
  <tr className="border-b last:border-none">
    {[...Array(skeletonCount)].map((_, index) => (
      <td key={index} className="px-4 py-3">
        <div className="h-4 rounded shimmer" />
      </td>
    ))}
  </tr>
);
export default SkeletonRow;
