# Designer JSON Format For Agents

This file describes the current JSON format used by `services/designer`.
It is intended for AI agents that need to generate a design file the designer
can load.

The current format is defined by:

- [src/lib/LeftPane/BottomTools.svelte](/home/meka/repos/freenit/services/designer/src/lib/LeftPane/BottomTools.svelte)
- [src/lib/utils.ts](/home/meka/repos/freenit/services/designer/src/lib/utils.ts)
- [src/lib/types.d.ts](/home/meka/repos/freenit/services/designer/src/lib/types.d.ts)
- [src/lib/store/theme.svelte.ts](/home/meka/repos/freenit/services/designer/src/lib/store/theme.svelte.ts)
- [src/lib/components/index.ts](/home/meka/repos/freenit/services/designer/src/lib/components/index.ts)
- [src/lib/LeftPane/Components.svelte](/home/meka/repos/freenit/services/designer/src/lib/LeftPane/Components.svelte)
- [src/lib/LeftPane/Icons.svelte](/home/meka/repos/freenit/services/designer/src/lib/LeftPane/Icons.svelte)

Ignore `design2.json`. It uses an older schema and does not match the current loader/exporter.

## Top-level shape

The file must be a JSON object with exactly two top-level keys:

```json
{
  "design": [
    /* root components */
  ],
  "theme": {
    /* theme variables */
  }
}
```

- `design` is an array of root components.
- `theme` is an object containing CSS-theme variables.

## Component schema

Each item in `design` and each nested `children` item is a component object.

Current practical schema:

```json
{
  "name": "Div",
  "id": "KdZwFnLI",
  "title": "optional-title",
  "children": [],
  "props": {},
  "css": {},
  "text": "",
  "open": true
}
```

Fields:

- `name`: required. Must match a component exported from `src/lib/components/index.ts`.
- `id`: required string. Should be unique within the file.
- `title`: optional except when needed by special components like icons.
- `children`: required array of child components.
- `props`: required object of HTML/SVG props/attributes.
- `css`: required object of CSS declarations.
- `text`: required string. Use `""` when the component has no text node.
- `open`: optional boolean used by the UI tree view.

Do not include `component`, `parent`, `index`, or `data`. Those are runtime fields, not persistence fields.

## Allowed `name` values

Use only names exported by [src/lib/components/index.ts](/home/meka/repos/freenit/services/designer/src/lib/components/index.ts).

Examples:

- `Div`
- `A`
- `Button`
- `Span`
- `Img`
- `Input`
- `H1` through `H6`
- `Section`
- `Header`
- `Footer`
- `Svg`
- `Path`

Names are case-sensitive. Use `Div`, not `div`. Use `Svg`, not `svg`.

## `props` rules

`props` is a flat object of attribute/value pairs.

Examples:

```json
{ "href": "https://example.com" }
```

```json
{ "src": "/logo.png", "alt": "Logo" }
```

```json
{ "d": "M5 5H7V11H5V5..." }
```

Rules:

- Keep values JSON-serializable.
- Use strings for normal HTML attributes unless a real boolean/number is clearly supported by the component and the designer already uses it.
- Do not wrap props in `{ "value": ... }`. That is the old format.
- `class` can be set in `props`, but the exporter will also generate a class automatically when `css` is non-empty.

## `css` rules

`css` is a flat object of CSS property names to values.

Example:

```json
{
  "display": "flex",
  "align-items": "center",
  "gap": "12px",
  "padding": "16px"
}
```

Rules:

- Use CSS property names as strings, usually kebab-case.
- Values should usually be strings like `"16px"`, `"flex"`, `"#666"`, `"100dvh"`.
- Plain numbers are technically allowed by type, but strings are safer and match current behavior.
- Color values can be stored as strings like `"#666"` or `"black"`.
- The loader can also hydrate color-like objects with `rgba`, but agents should prefer plain CSS color strings unless they are intentionally generating theme color objects.

## Text handling

`text` is a plain string rendered inside the component after all children.

Example:

```json
{
  "name": "A",
  "text": "example link",
  "props": { "href": "https://example.com" },
  "css": { "color": "black" },
  "children": []
}
```

If there is no text, use:

```json
"text": ""
```

## Icons

Icons are represented as an `Svg` component containing one `Path` child.

Example:

```json
{
  "name": "Svg",
  "id": "IconWrap",
  "title": "mdiAbacus",
  "text": "",
  "props": {},
  "css": {
    "width": "26px",
    "height": "26px",
    "fill": "#666"
  },
  "children": [
    {
      "name": "Path",
      "id": "IconPath",
      "title": "mdiAbacus",
      "text": "",
      "props": {
        "d": "M5 5H7V11H5V5..."
      },
      "children": [],
      "css": {
        "width": "26px",
        "height": "26px",
        "fill": "#666"
      }
    }
  ]
}
```

Rules for icons:

- `Svg.title` should be the MDI export name, for example `mdiAbacus`.
- `Path.title` should match the same icon name.
- `Path.props.d` should contain the actual SVG path string.
- In exported Svelte code, `Svg.title` is used to generate the `@mdi/js` import name.
- If you generate icons, prefer names that exist in `@mdi/js`.

## Theme schema

`theme` is an object of CSS variable names to values.

Current built-in keys are defined in [src/lib/store/theme.svelte.ts](/home/meka/repos/freenit/services/designer/src/lib/store/theme.svelte.ts):

- `bg-color`
- `bg-secondary-color`
- `color-primary`
- `color-lightGrey`
- `color-grey`
- `color-darkGrey`
- `color-error`
- `color-success`
- `grid-maxWidth`
- `grid-gutter`
- `font-size`
- `font-color`
- `font-family-sans`
- `font-family-mono`

String-valued theme entries look like:

```json
"grid-maxWidth": "120rem"
```

Color-valued theme entries are persisted as objects with `parsed` and `rgba` payloads:

```json
"color-primary": {
  "parsed": { "r": 20, "g": 133, "b": 79, "a": 1 },
  "rgba": { "r": 20, "g": 133, "b": 79, "a": 1 }
}
```

For maximum compatibility:

- use color objects with `parsed` and `rgba` for color theme keys
- use plain strings for spacing/font/grid keys

If the task does not require a custom theme, keep the standard built-in keys and values that the designer initializes in `ThemeStore`.

## Export behavior agents should know

The designer exports Svelte code from JSON with these important rules:

- Text nodes become entries in a `data` object keyed by component id.
- If a component has non-empty `css`, export gives that element `class="<id>"`.
- CSS for each component becomes a class block named with the component id.
- `Svg` titles are collected into an `@mdi/js` import list.
- `Path.props.d` is exported as `d={IconName}` only when the component is `Path`.

Implications:

- ids must be unique
- `title` matters for icons
- `css` should be attached to the element you want turned into a class block

## Recommended agent workflow

1. Start from the exact top-level shape shown above.
2. Reuse the built-in theme keys unless the prompt explicitly asks for theme changes.
3. Build the page as a tree of components under the `design` array.
4. Use only component names from `src/lib/components/index.ts`.
5. For icons, generate an `Svg` with one `Path` child and consistent `title`.
6. Put content in `text`, not inside a fake text child.
7. Put element attributes in `props`.
8. Put visual styling in `css`.
9. Keep every component’s `children`, `props`, `css`, and `text` present even when empty.
10. Output valid JSON only.

## Minimal example

This is the smallest valid pattern for a container with a link and an icon:

```json
{
  "design": [
    {
      "name": "Div",
      "id": "RootWrap",
      "children": [
        {
          "name": "A",
          "id": "MainLink",
          "children": [],
          "props": {
            "href": "https://example.com"
          },
          "css": {
            "color": "black"
          },
          "text": "example"
        },
        {
          "name": "Svg",
          "id": "IconWrap",
          "title": "mdiAbacus",
          "children": [
            {
              "name": "Path",
              "id": "IconPath",
              "title": "mdiAbacus",
              "children": [],
              "props": {
                "d": "M5 5H7V11H5V5M10 5H8V11H10V5M5 19H7V13H5V19M10 13H8V19H10V17H15V15H10V13M2 21H4V3H2V21M20 3V7H13V5H11V11H13V9H20V15H18V13H16V19H18V17H20V21H22V3H20Z"
              },
              "css": {
                "width": "26px",
                "height": "26px",
                "fill": "#666"
              },
              "text": ""
            }
          ],
          "props": {},
          "css": {
            "width": "26px",
            "height": "26px",
            "fill": "#666"
          },
          "text": ""
        }
      ],
      "props": {},
      "css": {},
      "text": "",
      "open": true
    }
  ],
  "theme": {
    "bg-color": {
      "parsed": { "r": 255, "g": 255, "b": 255, "a": 1 },
      "rgba": { "r": 255, "g": 255, "b": 255, "a": 1 }
    },
    "bg-secondary-color": {
      "parsed": { "r": 243, "g": 243, "b": 246, "a": 1 },
      "rgba": { "r": 243, "g": 243, "b": 246, "a": 1 }
    },
    "color-primary": {
      "parsed": { "r": 20, "g": 133, "b": 79, "a": 1 },
      "rgba": { "r": 20, "g": 133, "b": 79, "a": 1 }
    },
    "color-lightGrey": {
      "parsed": { "r": 210, "g": 214, "b": 221, "a": 1 },
      "rgba": { "r": 210, "g": 214, "b": 221, "a": 1 }
    },
    "color-grey": {
      "parsed": { "r": 116, "g": 118, "b": 129, "a": 1 },
      "rgba": { "r": 116, "g": 118, "b": 129, "a": 1 }
    },
    "color-darkGrey": {
      "parsed": { "r": 63, "g": 65, "b": 68, "a": 1 },
      "rgba": { "r": 63, "g": 65, "b": 68, "a": 1 }
    },
    "color-error": {
      "parsed": { "r": 212, "g": 57, "b": 57, "a": 1 },
      "rgba": { "r": 212, "g": 57, "b": 57, "a": 1 }
    },
    "color-success": {
      "parsed": { "r": 40, "g": 189, "b": 20, "a": 1 },
      "rgba": { "r": 40, "g": 189, "b": 20, "a": 1 }
    },
    "grid-maxWidth": "120rem",
    "grid-gutter": "2rem",
    "font-size": "1.6rem",
    "font-color": {
      "parsed": { "r": 51, "g": 51, "b": 51, "a": 1 },
      "rgba": { "r": 51, "g": 51, "b": 51, "a": 1 }
    },
    "font-family-sans": "sans-serif",
    "font-family-mono": "monaco, Consolas, Lucida Console, monospace"
  }
}
```
