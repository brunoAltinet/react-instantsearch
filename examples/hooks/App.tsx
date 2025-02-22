import { Hit as AlgoliaHit } from '@algolia/client-search';
import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import { InstantSearch, DynamicWidgets } from 'react-instantsearch-hooks';

import {
  Configure,
  HierarchicalMenu,
  Highlight,
  Hits,
  Pagination,
  Panel,
  RangeInput,
  RefinementList,
  Menu,
  SearchBox,
  SortBy,
  HitsPerPage,
  QueryRuleContext,
  QueryRuleCustomData,
  CurrentRefinements,
} from './components';

import './App.css';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </>
  );
}

export function App() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="instant_search"
      routing={true}
    >
      <Configure hitsPerPage={15} />

      <div className="Container">
        <div>
          <DynamicWidgets>
            <Panel header="Brands">
              <RefinementList
                attribute="brand"
                searchable={true}
                searchablePlaceholder="Search brands"
                showMore={true}
              />
            </Panel>
            <Panel header="Categories">
              <Menu attribute="categories" showMore={true} />
            </Panel>
            <Panel header="Hierarchy">
              <HierarchicalMenu
                attributes={[
                  'hierarchicalCategories.lvl0',
                  'hierarchicalCategories.lvl1',
                  'hierarchicalCategories.lvl2',
                ]}
                showMore={true}
              />
            </Panel>
            <Panel header="Price">
              <RangeInput attribute="price" />
            </Panel>
          </DynamicWidgets>
        </div>
        <div className="Search">
          <div className="Search-header">
            <SearchBox placeholder="Search" />
            <SortBy
              items={[
                { label: 'Relevance', value: 'instant_search' },
                { label: 'Price (asc)', value: 'instant_search_price_asc' },
                { label: 'Price (desc)', value: 'instant_search_price_desc' },
              ]}
            />
            <HitsPerPage
              items={[
                { label: '4 hits per page', value: 4, default: true },
                { label: '8 hits per page', value: 8 },
              ]}
            />
          </div>

          <CurrentRefinements
            transformItems={(items) =>
              items.map((item) => {
                const attribute = item.attribute.startsWith(
                  'hierarchicalCategories'
                )
                  ? 'Hierarchy'
                  : item.attribute;

                return {
                  ...item,
                  attribute,
                  refinements: item.refinements.map((refinement) => ({
                    ...refinement,
                    attribute,
                  })),
                };
              })
            }
          />

          <QueryRuleContext
            trackedFilters={{
              brand: () => ['Apple'],
            }}
          />

          <QueryRuleCustomData>
            {({ items }) => (
              <>
                {items.map((item) => (
                  <a href={item.link} key={item.banner}>
                    <img src={item.banner} alt={item.title} />
                  </a>
                ))}
              </>
            )}
          </QueryRuleCustomData>

          <Hits hitComponent={Hit} />
          <Pagination className="Pagination" />
        </div>
      </div>
    </InstantSearch>
  );
}
