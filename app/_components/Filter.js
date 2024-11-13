'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';

function Filter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeFilter = searchParams.get('capacity') ?? 'all';

  function handleFilter(value) {
    const params = new URLSearchParams(searchParams);
    params.set('capacity', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button onFilter={handleFilter} activeFilter={activeFilter} filter="all">
        All cabins
      </Button>
      <Button
        onFilter={handleFilter}
        activeFilter={activeFilter}
        filter="small"
      >
        1&mdash;3 guests
      </Button>
      <Button
        onFilter={handleFilter}
        activeFilter={activeFilter}
        filter="medium"
      >
        4&mdash;7 guests
      </Button>
      <Button
        onFilter={handleFilter}
        activeFilter={activeFilter}
        filter="large"
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ filter, onFilter, activeFilter, children }) {
  return (
    <button
      onClick={() => onFilter(filter)}
      className={`${
        activeFilter === filter && 'bg-primary-700 text-primary-50'
      } px-5 py-2 hover:bg-primary-700`}
    >
      {children}
    </button>
  );
}

export default Filter;
