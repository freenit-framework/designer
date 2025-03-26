elements='a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote br button canvas caption center cite code col colgroup data datalist dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr i iframe img input ins kbd label legend li link main map mark meter nav noframes noscript ol option optgroup output p param path picture pre progress q rp rt ruby s samp section select small source span strike strong sub summary sup svg table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'

BIN_DIR=`dirname $0`
PROJECT_ROOT="${BIN_DIR}/.."
components_dir="${PROJECT_ROOT}/src/lib/components"

nochildren() {
  case $1 in
    img|hr|br|wbr|area|base|col|embed|input|link|param|source|track|textarea)
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

void() {
  case $1 in
    br)
      echo "yes"
      ;;
    *)
      echo "no"
  esac
}

generate() {
  element=$1
  no_children=`nochildren ${element}`
  no_props=`noprops ${element}`
  is_void=`void ${element}`
  myprops=""
  elprops=""
  a11y=""

  if [ "${element}" = "a" ]; then
    myprops=" href: '' "
    elprops="href={props.href} "
  elif [ "${element}" = "iframe" ]; then
    myprops=" title: '' "
    elprops="title={props.title} "
  elif [ "${element}" = "object" ]; then
    myprops=" title: '' "
    elprops="title={props.title} "
  elif [ "${element}" = "area" ]; then
    myprops=" alt: '' "
    elprops="alt={props.alt} "
  elif [ "${element}" = "img" ]; then
    myprops=" alt: '' "
    elprops="alt={props.alt} "
  elif [ "${element}" = "video" ]; then
    a11y="<!-- svelte-ignore a11y_media_has_caption -->"
  elif [ "${element}" = "figcaption" ]; then
    a11y="<!-- svelte-ignore a11y_figcaption_parent -->"
  fi

  if [ "${is_void}" = "yes" ]; then
    cat <<EOF
<script lang="ts">
</script>

<${element} />
EOF
  elif [ "${no_children}" = "yes" -a "${no_props}" = "yes" ]; then
    cat <<EOF
<script lang="ts">
</script>

<${element}></${element}>
EOF
  elif [ "${no_children}" = "yes" ]; then
    cat <<EOF
<script lang="ts">
  let props = \$props()
</script>

<${element} {...props} />
EOF
  elif [ "${no_props}" = "yes" ]; then
    cat <<EOF
<script lang="ts">
  let { children } = \$props()
</script>

<${element}>
  {@render children?.()}
</${element}>
EOF
  else
    cat <<EOF
<script lang="ts">
  let { children, ...props } = \$props()
</script>

$a11y
<${element} ${elprops} {...props}>
  {@render children?.()}
</${element}>
EOF
  fi

}

rm -rf "${components_dir}"
mkdir "${components_dir}"
for element in ${elements}; do
  component=`echo ${element} | awk '{print toupper(substr($0,0,1))tolower(substr($0,2))}'`
  component_file="${components_dir}/${component}.svelte"
  generate ${element} >"${component_file}"
  echo "export { default as ${component} } from './${component}.svelte'" >>"${components_dir}/index.ts"
done
EOF

npm run format
