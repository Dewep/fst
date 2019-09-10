# File format `.fst`

## General file structure

1. Main header part
2. List of pages

Each page can contain only one type of information, but all pages have the same size (defined with the main header).

## Main header (`size=38`)

1. Magic number (`://dewep.net/fst 1.0\n\x00`) (`size=22`)
2. Number of pages in the file (included the free pages) (`size=4`)
3. Page number for the root `search-nodes` page (`size=4`)
3. Page number for the root `records-nodes` page (`size=4`)
3. Page number for the `facets-nodes` page (`size=4`)
4. Number of free pages (`size=4`)
5. Page number of the 1st free page (`size=4`)

## Version 1.0

Current version. Database page size of 1024.

All pages will start with the common header:

- Page type (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no more overflow) (`size=4`)

### Page format (`size=1024`)

Page types:

- `\x00`: `free` (in case we remove some pages)
- `\x01`: `overflow` (used to contained extra data from other pages)
- `\x10`: `search-nodes` (used to list search nodes)
- `\x11`: `search-node-records` (list records for a node)
- `\x20`: `facets-nodes` (used to list facets nodes)
- `\x21`: `facet-node-values` (values for a facet)
- `\x22`: `facet-node-value-records` (records for a value for a facet)
- `\x30`: `records-nodes` (used to list records nodes)
- `\x31`: `record-node` (record content)

### Pages `free` (`size=5+1019`)

In case we remove some pages.

- Page type `\x00` (`size=1`)
- Number of the next page `\x00` (`size=4`)

### Pages `overflow` (`size=5+1019`)

Used to contained extra data from other pages.

- Page type `\x01` (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no more overflow) (`size=4`)

### Pages `search-nodes` (`size=6+1018`)

List of nodes for the search feature. One of these pages is the root list.

- Page type `\x10` (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no overflow) (`size=4`)
- Number of nodes (`size=1`)
- List of nodes (`size=9*`)
  - Node value size (`size=1`)
  - Page number for the child `search-nodes` (`\x00` means no children) (`size=4`)
  - Page number for the `search-node-records` (`\x00` means no record) (`size=4`)
  - Node value content (size from `1.`)

### Page `search-node-records` (`size=13+1011`)

- Page type `\x11` (`size=1`)
- Number of the next page (in case of overflow, `0` mean no overflow) (`size=4`)
- Number of records (`size=4`)
- Total buffer size (`size=4`)
- Buffer compressed with gzip DEFLATE (size from previous field). This is the list of the slugs (string), joined by `\x00`.

### Pages `facets-nodes` (`size=?`)

- Page type `\x20` (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no overflow) (`size=4`)
- TODO

### Pages `facet-node-values` (`size=?`)

- Page type `\x21` (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no overflow) (`size=4`)
- TODO

### Pages `facet-node-value-records` (`size=?`)

- Page type `\x22` (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no overflow) (`size=4`)
- TODO

### Pages `records-nodes` (`size=?`)

- Page type `\x30` (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no overflow) (`size=4`)
- Number of nodes (`size=1`)
- List of nodes (`size=9*`)
  - Node value size (`size=1`)
  - Page number for the child `records-nodes` (`\x00` means no children) (`size=4`)
  - Page number for the `record-node` (`\x00` means no record) (`size=4`)
  - Node value content (size from `1.`)

### Pages `record-node` (`size=?`)

- Page type `\x31` (`size=1`)
- Number of the next page (in case of overflow, `\x00` mean no overflow) (`size=4`)
- Total buffer size (`size=4`)
- Buffer compressed with gzip DEFLATE (size from previous field)
