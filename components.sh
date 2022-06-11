elements='a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote br button canvas caption center cite code col colgroup data datalist dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr i iframe img input ins kbd label legend li link main map mark meter nav noframes noscript object ol optgroup output p param path picture pre progress q rp rt ruby s samp section select small source span strike strong sub summary sup svg table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'
components_dir='src/lib/components'

nochildren() {
  case $1 in
    img|hr|br|wbr|area|base|col|embed|input|link|param|source|track)
      echo "yes"
      ;;
    *)
      echo "no"
      ;;
  esac
}

noprops() {
  case $1 in
    textarea|br)
      echo "yes"
      ;;
    *)
      echo "no"
      ;;
  esac
}

generate() {
  element=$1
  no_children=`nochildren ${element}`
  no_props=`noprops ${element}`

  if [ "${no_children}" = "yes" -a "${no_props}" = "yes" ]; then
    cat <<EOF
<script lang="ts">
  import { prepareStyle } from '\$lib/utils'

  export let style = {}
</script>

<${element} style={prepareStyle(style)} />
EOF
  elif [ "${no_children}" = "yes" ]; then
    cat <<EOF
<script lang="ts">
  import { prepareStyle } from '\$lib/utils'

  export let style = {}
  export let props = {}
</script>

<${element} {...props} style={prepareStyle(style)} />
EOF
  elif [ "${no_props}" = "yes" ]; then
    cat <<EOF
<script lang="ts">
  import { prepareStyle } from '\$lib/utils'
  import { dragStart, dragEnd, drop } from '\$lib/utils/dnd'
  import { compile } from '\$lib/utils/props'
  import type { Component } from '\$lib/types'

  export let style = {}
  export let data: Component = {
    id: '',
    name: '',
    component: '',
    props: compile({}),
    style: compile({}),
    children: [],
    text: '',
  }
  export let parent: Component = {
    id: '',
    component: '',
    name: '',
    text: '',
    children: [],
    props: {},
    style: {},
  }
  export let index = -1
</script>

<${element}
  style={prepareStyle(style)}
  draggable={true}
  on:dragstart={dragStart(data, parent, index)}
  on:dragend={dragEnd}
  on:drop={drop(data)}
>
  <slot />
</${element}>
EOF
  else
    cat <<EOF
<script lang="ts">
  import { prepareStyle } from '\$lib/utils'
  import { dragStart, dragEnd, drop } from '\$lib/utils/dnd'
  import { compile } from '\$lib/utils/props'
  import type { Component } from '\$lib/types'

  export let props = {}
  export let style = {}
  export let data: Component = {
    id: '',
    name: '',
    component: '',
    props: compile({}),
    style: compile({}),
    children: [],
    text: '',
  }
  export let parent: Component = {
    id: '',
    component: '',
    name: '',
    text: '',
    children: [],
    props: {},
    style: {},
  }
  export let index = -1
</script>

<${element}
  {...props}
  style={prepareStyle(style)}
  draggable={true}
  on:dragstart={dragStart(data, parent, index)}
  on:dragend={dragEnd}
  on:drop={drop(data)}
>
  <slot />
</${element}>
EOF
  fi

}

rm ${components_dir}/*.svelte
for element in ${elements}; do
  component=`echo ${element} | awk '{print toupper(substr($0,0,1))tolower(substr($0,2))}'`
  component_file="${components_dir}/${component}.svelte"
  generate ${element} >"${component_file}"
done