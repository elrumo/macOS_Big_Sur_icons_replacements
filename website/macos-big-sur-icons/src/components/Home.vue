<template>
  <div>
    
    <Dialog/>
    <!-- Header -->
    <Header/>
    
    <deleteDialog :icon="activeIcon"/>

    <coral-dialog id="bitcoin">
        <coral-dialog-header>Donate</coral-dialog-header>
        
        <coral-dialog-content>
            <svg fill="none" height="407" viewBox="0 0 345 407" width="345" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><filter id="a" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="407" width="345" x="0" y="0"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="4"/><feGaussianBlur stdDeviation="17"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape"/></filter><pattern id="b" height="1" patternContentUnits="objectBoundingBox" width="1"><image height="132" transform="scale(.00757576)" width="132" xlink:href="data:image/png;base64,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"/></pattern><g filter="url(#a)"><rect fill="#fff" height="339" rx="9" width="277" x="34" y="30"/><path d="m43 40h259v259h-259z" fill="url(#b)"/><path d="m35 306.5h275" stroke="#b1b1b1"/><g fill="#000"><path d="m61.2852 342.207h.8144c.5117-.008.9141-.143 1.207-.404.293-.262.4395-.615.4395-1.061 0-1-.4981-1.5-1.4941-1.5-.4688 0-.8438.135-1.125.404-.2774.266-.4161.62-.4161 1.061h-1.0839c0-.676.246-1.236.7382-1.682.4961-.449 1.125-.673 1.8868-.673.8046 0 1.4355.212 1.8925.638.4571.426.6856 1.018.6856 1.776 0 .371-.1211.73-.3633 1.078-.2383.347-.5645.607-.9785.779.4687.148.8301.395 1.084.738.2578.344.3867.764.3867 1.26 0 .766-.25 1.373-.75 1.822-.5.45-1.1504.674-1.9512.674s-1.4531-.217-1.957-.65c-.5-.434-.75-1.006-.75-1.717h1.0898c0 .449.1465.809.4395 1.078.2929.27.6855.404 1.1777.404.5234 0 .9238-.136 1.2012-.41.2773-.273.416-.666.416-1.177 0-.497-.1523-.877-.457-1.143s-.7442-.402-1.3184-.41h-.8144z"/><path d="m72.0371 347h-5.5898v-.779l2.9531-3.282c.4375-.496.7383-.898.9023-1.207.168-.312.252-.634.252-.966 0-.446-.1348-.811-.4043-1.096s-.6289-.428-1.0781-.428c-.5391 0-.959.154-1.2598.463-.2969.305-.4453.731-.4453 1.277h-1.084c0-.785.252-1.42.7559-1.904.5078-.484 1.1855-.726 2.0332-.726.7929 0 1.4199.209 1.8808.627.461.414.6914.966.6914 1.658 0 .84-.5351 1.84-1.6054 3l-2.2852 2.478h4.2832z"/><path d="m74.416 340.66v7.072c0 1.219-.5527 1.829-1.6582 1.829-.2383 0-.459-.036-.6621-.106v-.867c.125.031.2891.047.4922.047.2422 0 .4258-.067.5508-.199.1289-.129.1933-.356.1933-.68v-7.096zm-1.1953-1.681c0-.172.0527-.319.1582-.44.1094-.125.2676-.187.4746-.187.211 0 .3711.06.4805.181s.164.27.164.446c0 .175-.0546.322-.164.439s-.2695.176-.4805.176c-.2109 0-.3691-.059-.4746-.176s-.1582-.264-.1582-.439z"/><path d="m81.7812 345.506 1.2188-4.846h1.084l-1.8457 6.34h-.8789l-1.541-4.805-1.5 4.805h-.8789l-1.8399-6.34h1.0781l1.2481 4.746 1.4765-4.746h.8731z"/><path d="m86.6621 339.125v1.535h1.1836v.838h-1.1836v3.932c0 .254.0527.445.1582.574.1055.125.2852.187.5391.187.125 0 .2968-.023.5156-.07v.879c-.2852.078-.5625.117-.832.117-.4844 0-.8496-.146-1.0957-.439s-.3692-.709-.3692-1.248v-3.932h-1.1543v-.838h1.1543v-1.535z"/><path d="m95.293 338.469v5.801c-.0039.804-.2578 1.462-.7618 1.974-.5.512-1.1796.799-2.039.861l-.2988.012c-.9336 0-1.6778-.252-2.2325-.756s-.8359-1.197-.8437-2.08v-5.812h1.1133v5.777c0 .617.1699 1.098.5097 1.442.3399.339.8243.509 1.4532.509.6367 0 1.123-.17 1.4589-.509.3399-.34.5098-.819.5098-1.436v-5.783z"/><path d="m102.295 339.078-3.5333 7.922h-1.1367l3.521-7.641h-4.6167v-.89h5.7657z"/><path d="m109.25 345.506 1.219-4.846h1.084l-1.846 6.34h-.879l-1.541-4.805-1.5 4.805h-.879l-1.84-6.34h1.078l1.249 4.746 1.476-4.746h.873z"/><path d="m115.959 343.549h-2.004v3.451h-1.131v-8.531h2.824c.961 0 1.7.219 2.215.656.52.437.78 1.074.78 1.91 0 .531-.145.994-.434 1.389-.285.394-.684.689-1.195.885l2.004 3.621v.07h-1.207zm-2.004-.92h1.729c.558 0 1.002-.145 1.33-.434.332-.289.498-.675.498-1.16 0-.527-.158-.931-.475-1.213-.312-.281-.766-.424-1.359-.427h-1.723z"/><path d="m122.146 345.529 1.571-4.869h1.107l-2.273 6.34h-.826l-2.297-6.34h1.107z"/><path d="m129.781 346.373c-.422.496-1.041.744-1.857.744-.676 0-1.192-.195-1.547-.586-.352-.394-.529-.976-.533-1.746v-4.125h1.084v4.096c0 .961.39 1.441 1.172 1.441.828 0 1.379-.308 1.652-.926v-4.611h1.084v6.34h-1.031z"/><path d="m137.369 344.773h-3.574l-.803 2.227h-1.16l3.258-8.531h.984l3.264 8.531h-1.154zm-3.234-.925h2.9l-1.453-3.991z"/><path d="m145.684 343.9c0 .969-.223 1.748-.668 2.338-.446.586-1.043.879-1.793.879-.801 0-1.42-.283-1.858-.849l-.053.732h-.996v-9h1.084v3.357c.438-.543 1.041-.814 1.811-.814.769 0 1.373.291 1.81.873.442.582.663 1.379.663 2.391zm-1.084-.123c0-.738-.143-1.308-.428-1.711-.285-.402-.695-.603-1.231-.603-.714 0-1.228.332-1.541.996v2.742c.332.664.85.996 1.553.996.52 0 .924-.201 1.213-.603.289-.403.434-1.008.434-1.817z"/><path d="m149.738 343.197c-.965-.277-1.668-.617-2.109-1.019-.438-.407-.656-.907-.656-1.5 0-.672.267-1.227.802-1.664.539-.442 1.239-.662 2.098-.662.586 0 1.107.113 1.565.339.46.227.816.539 1.066.938.254.398.381.834.381 1.307h-1.131c0-.516-.164-.92-.492-1.213-.328-.297-.791-.446-1.389-.446-.555 0-.988.123-1.301.369-.308.243-.463.581-.463 1.014 0 .348.147.643.44.885.297.238.799.457 1.506.656.711.199 1.265.42 1.664.662.402.239.699.518.89.838.196.32.293.697.293 1.131 0 .691-.269 1.246-.808 1.664-.539.414-1.26.621-2.162.621-.586 0-1.133-.111-1.641-.334-.508-.226-.9-.535-1.178-.926-.273-.39-.41-.834-.41-1.33h1.131c0 .516.189.924.568 1.225.383.297.893.445 1.53.445.593 0 1.048-.121 1.365-.363.316-.242.474-.572.474-.99s-.146-.74-.439-.967c-.293-.231-.824-.457-1.594-.68z"/><path d="m156.723 346.232c.386 0 .724-.117 1.013-.351.289-.235.45-.527.481-.879h1.025c-.019.363-.144.709-.375 1.037-.23.328-.539.59-.926.785-.382.196-.789.293-1.218.293-.864 0-1.551-.287-2.063-.861-.508-.578-.762-1.367-.762-2.367v-.182c0-.617.114-1.166.34-1.646.227-.481.551-.854.973-1.12.426-.265.928-.398 1.506-.398.711 0 1.301.213 1.769.639.473.425.725.978.756 1.658h-1.025c-.031-.41-.188-.746-.469-1.008-.277-.266-.621-.398-1.031-.398-.551 0-.979.199-1.283.597-.301.395-.452.967-.452 1.717v.205c0 .731.151 1.293.452 1.688.3.394.73.591 1.289.591z"/><path d="m164.604 338.463v.92h-.2c-.843.015-1.515.265-2.015.75-.5.484-.789 1.166-.868 2.045.45-.516 1.063-.774 1.84-.774.743 0 1.334.262 1.776.785.445.524.668 1.2.668 2.028 0 .879-.241 1.582-.721 2.109-.477.528-1.117.791-1.922.791-.816 0-1.478-.312-1.986-.937-.508-.629-.762-1.438-.762-2.426v-.416c0-1.57.334-2.77 1.002-3.598.672-.832 1.67-1.258 2.994-1.277zm-1.424 3.844c-.371 0-.713.111-1.026.334-.312.222-.529.502-.65.838v.398c0 .703.158 1.269.475 1.699.316.43.71.645 1.183.645.488 0 .871-.18 1.149-.539.281-.36.421-.83.421-1.412 0-.586-.142-1.059-.427-1.418-.282-.364-.657-.545-1.125-.545z"/><path d="m167.369 347v-8.531h2.408c.743 0 1.399.164 1.969.492s1.01.795 1.318 1.4c.313.606.471 1.301.475 2.086v.545c0 .805-.156 1.51-.469 2.115-.308.606-.752 1.071-1.33 1.395-.574.324-1.244.49-2.01.498zm1.125-7.605v6.685h1.184c.867 0 1.541-.269 2.021-.809.485-.539.727-1.306.727-2.302v-.498c0-.969-.229-1.721-.686-2.256-.453-.539-1.097-.813-1.933-.82z"/><path d="m177.201 342.975 1.406-2.315h1.266l-2.074 3.135 2.139 3.205h-1.254l-1.465-2.373-1.465 2.373h-1.26l2.139-3.205-2.074-3.135h1.253z"/><path d="m182.146 340.66v7.072c0 1.219-.552 1.829-1.658 1.829-.238 0-.459-.036-.662-.106v-.867c.125.031.289.047.492.047.243 0 .426-.067.551-.199.129-.129.193-.356.193-.68v-7.096zm-1.195-1.681c0-.172.053-.319.158-.44.11-.125.268-.187.475-.187.211 0 .371.06.48.181.11.121.165.27.165.446 0 .175-.055.322-.165.439-.109.117-.269.176-.48.176s-.369-.059-.475-.176c-.105-.117-.158-.264-.158-.439z"/><path d="m187.35 347h-1.09v-7.225l-2.186.803v-.984l3.106-1.166h.17z"/><path d="m195.992 343.9c0 .965-.221 1.743-.662 2.332-.441.59-1.039.885-1.793.885-.769 0-1.375-.244-1.816-.732v3.053h-1.084v-8.778h.99l.053.703c.441-.547 1.054-.82 1.84-.82.761 0 1.363.287 1.804.861.446.575.668 1.373.668 2.397zm-1.084-.123c0-.715-.152-1.279-.457-1.693s-.722-.621-1.254-.621c-.656 0-1.148.291-1.476.873v3.029c.324.578.82.867 1.488.867.52 0 .932-.205 1.236-.615.309-.414.463-1.027.463-1.84z"/><path d="m201.289 346.373c-.422.496-1.041.744-1.857.744-.676 0-1.192-.195-1.547-.586-.352-.394-.53-.976-.533-1.746v-4.125h1.084v4.096c0 .961.39 1.441 1.171 1.441.829 0 1.379-.308 1.653-.926v-4.611h1.084v6.34h-1.032z"/><path d="m208.139 338.463v.92h-.2c-.843.015-1.515.265-2.015.75-.5.484-.789 1.166-.867 2.045.449-.516 1.062-.774 1.839-.774.743 0 1.334.262 1.776.785.445.524.668 1.2.668 2.028 0 .879-.24 1.582-.721 2.109-.476.528-1.117.791-1.922.791-.816 0-1.478-.312-1.986-.937-.508-.629-.762-1.438-.762-2.426v-.416c0-1.57.334-2.77 1.002-3.598.672-.832 1.67-1.258 2.994-1.277zm-1.424 3.844c-.371 0-.713.111-1.026.334-.312.222-.529.502-.65.838v.398c0 .703.158 1.269.475 1.699.316.43.711.645 1.183.645.489 0 .871-.18 1.149-.539.281-.36.422-.83.422-1.412 0-.586-.143-1.059-.428-1.418-.281-.364-.656-.545-1.125-.545z"/><path d="m210.477 343.777c0-.988.228-1.773.685-2.355.457-.586 1.063-.879 1.817-.879.773 0 1.376.273 1.81.82l.053-.703h.99v6.188c0 .82-.244 1.466-.732 1.939-.485.473-1.137.709-1.957.709-.457 0-.905-.098-1.342-.293-.438-.195-.772-.463-1.002-.803l.562-.65c.465.574 1.034.861 1.705.861.528 0 .938-.148 1.231-.445.297-.297.445-.715.445-1.254v-.545c-.433.5-1.025.75-1.775.75-.742 0-1.344-.299-1.805-.896-.457-.598-.685-1.412-.685-2.444zm1.089.123c0 .715.147 1.278.44 1.688.293.406.703.609 1.23.609.684 0 1.186-.31 1.506-.931v-2.895c-.332-.605-.83-.908-1.494-.908-.527 0-.939.205-1.236.615s-.446 1.018-.446 1.822z"/><path d="m217.643 347v-8.531h2.789c.925 0 1.621.191 2.086.574.468.383.703.949.703 1.699 0 .399-.114.752-.34 1.061-.227.304-.535.541-.926.709.461.129.824.375 1.09.738.269.359.404.789.404 1.289 0 .766-.248 1.367-.744 1.805-.496.437-1.197.656-2.103.656zm1.125-3.99v3.07h1.857c.523 0 .936-.135 1.236-.404.305-.274.457-.649.457-1.125 0-1.028-.558-1.541-1.675-1.541zm0-.903h1.699c.492 0 .885-.123 1.178-.369.296-.246.445-.58.445-1.002 0-.468-.137-.808-.41-1.019-.274-.215-.69-.322-1.248-.322h-1.664z"/><path d="m227.041 345.529 1.57-4.869h1.108l-2.274 6.34h-.826l-2.297-6.34h1.108z"/><path d="m235.637 343.232h-3.58v3.768h-1.125v-8.531h5.285v.926h-4.16v2.917h3.58z"/><path d="m240.693 343.549h-2.004v3.451h-1.13v-8.531h2.824c.961 0 1.699.219 2.215.656.519.437.779 1.074.779 1.91 0 .531-.145.994-.434 1.389-.285.394-.683.689-1.195.885l2.004 3.621v.07h-1.207zm-2.004-.92h1.729c.559 0 1.002-.145 1.33-.434.332-.289.498-.675.498-1.16 0-.527-.158-.931-.475-1.213-.312-.281-.765-.424-1.359-.427h-1.723z"/><path d="m246.084 343.66v3.34h-1.125v-8.531h3.146c.934 0 1.665.238 2.192.715.531.476.797 1.107.797 1.892 0 .828-.26 1.467-.78 1.916-.515.446-1.255.668-2.22.668zm0-.92h2.021c.602 0 1.063-.14 1.383-.422.321-.285.481-.695.481-1.23 0-.508-.16-.914-.481-1.219-.32-.305-.759-.463-1.318-.474h-2.086z"/><path d="m253.912 339.125v1.535h1.184v.838h-1.184v3.932c0 .254.053.445.158.574.106.125.285.187.539.187.125 0 .297-.023.516-.07v.879c-.285.078-.563.117-.832.117-.484 0-.85-.146-1.096-.439s-.369-.709-.369-1.248v-3.932h-1.154v-.838h1.154v-1.535z"/><path d="m260.51 338.463v.92h-.199c-.844.015-1.516.265-2.016.75-.5.484-.789 1.166-.867 2.045.449-.516 1.062-.774 1.84-.774.742 0 1.334.262 1.775.785.445.524.668 1.2.668 2.028 0 .879-.24 1.582-.721 2.109-.476.528-1.117.791-1.922.791-.816 0-1.478-.312-1.986-.937-.508-.629-.762-1.438-.762-2.426v-.416c0-1.57.334-2.77 1.002-3.598.672-.832 1.67-1.258 2.994-1.277zm-1.424 3.844c-.371 0-.713.111-1.025.334-.313.222-.53.502-.651.838v.398c0 .703.158 1.269.475 1.699.316.43.711.645 1.183.645.489 0 .871-.18 1.149-.539.281-.36.422-.83.422-1.412 0-.586-.143-1.059-.428-1.418-.281-.364-.656-.545-1.125-.545z"/><path d="m266.85 338.469h1.13v6.041c0 .816-.246 1.455-.738 1.916-.488.461-1.14.691-1.957.691-.847 0-1.508-.217-1.98-.65-.473-.434-.709-1.041-.709-1.822h1.125c0 .488.133.869.398 1.142.27.274.658.41 1.166.41.465 0 .84-.146 1.125-.439.289-.293.436-.703.44-1.231z"/><path d="m272.064 343.033-1.043 1.084v2.883h-1.125v-8.531h1.125v4.219l3.791-4.219h1.36l-3.358 3.767 3.622 4.764h-1.348z"/><path d="m283.748 343.01c0 .824-.131 1.535-.393 2.133-.261.593-.628 1.058-1.101 1.394l1.523 1.195-.767.709-1.799-1.429c-.281.07-.578.105-.891.105-.672 0-1.267-.164-1.787-.492-.519-.332-.924-.803-1.213-1.412-.285-.613-.431-1.322-.439-2.127v-.615c0-.821.142-1.545.428-2.174.285-.629.687-1.109 1.207-1.442.523-.335 1.121-.503 1.793-.503.687 0 1.291.166 1.81.498.524.332.926.81 1.207 1.435.281.621.422 1.348.422 2.18zm-1.125-.551c0-1.004-.201-1.777-.603-2.32-.399-.547-.969-.821-1.711-.821-.707 0-1.266.272-1.676.815-.406.539-.615 1.289-.627 2.25v.627c0 .976.203 1.746.609 2.308.41.563.979.844 1.705.844.727 0 1.289-.264 1.688-.791.398-.531.603-1.291.615-2.279z"/><g opacity=".5"><path d="m59.6348 331v-7.109h2.4902c.8626 0 1.5169.166 1.9629.498.446.328.6689.812.6689 1.45 0 .348-.0895.656-.2685.923-.1791.263-.4281.457-.7471.581.3646.091.6511.275.8594.552.2116.276.3174.615.3174 1.015 0 .684-.2181 1.201-.6543 1.553-.4362.351-1.058.53-1.8653.537zm1.4648-3.096v1.919h1.2549c.345 0 .6136-.081.8057-.244.1953-.166.2929-.394.2929-.683 0-.652-.3369-.982-1.0107-.992zm0-1.035h1.084c.7389-.013 1.1084-.307 1.1084-.884 0-.322-.0944-.553-.2832-.693-.1856-.143-.4802-.215-.8838-.215h-1.0254z"/><path d="m67.418 331h-1.416v-5.283h1.416zm-1.4991-6.65c0-.212.07-.386.21-.523.1432-.137.3369-.205.5811-.205.2408 0 .4329.068.5761.205.1433.137.2149.311.2149.523 0 .214-.0733.39-.2198.527-.1432.137-.3336.205-.5712.205-.2377 0-.4297-.068-.5762-.205-.1432-.137-.2149-.313-.2149-.527z"/><path d="m70.2744 324.418v1.299h.9033v1.035h-.9033v2.637c0 .195.0374.335.1123.42.0749.084.2181.127.4297.127.1563 0 .2946-.012.415-.035v1.07c-.2766.084-.5615.127-.8544.127-.9896 0-1.4942-.5-1.5137-1.499v-2.847h-.7715v-1.035h.7715v-1.299z"/><path d="m74.1611 329.96c.2604 0 .472-.072.6348-.215s.2474-.334.2539-.571h1.3232c-.0032.358-.1009.687-.2929.986-.1921.296-.4558.528-.791.694-.3321.162-.6999.244-1.1036.244-.7552 0-1.3509-.24-1.7871-.718-.4362-.482-.6543-1.146-.6543-1.992v-.093c0-.814.2165-1.463.6495-1.948.4329-.485 1.027-.728 1.7822-.728.6608 0 1.1898.189 1.5869.567.4004.374.6038.874.6103 1.499h-1.3232c-.0065-.274-.0911-.495-.2539-.664-.1628-.173-.3776-.259-.6445-.259-.3288 0-.5778.12-.7471.361-.166.238-.249.625-.249 1.162v.147c0 .543.083.934.249 1.172.166.237.4183.356.7568.356z"/><path d="m76.959 328.31c0-.525.1009-.992.3027-1.402s.4916-.727.8692-.952c.3808-.225.8219-.337 1.3232-.337.7129 0 1.2939.218 1.7432.654.4524.437.7047 1.029.7568 1.778l.0098.361c0 .811-.2263 1.462-.6787 1.953-.4525.489-1.0596.733-1.8213.733-.7618 0-1.3705-.244-1.8262-.733-.4525-.488-.6787-1.152-.6787-1.992zm1.4111.102c0 .501.0944.886.2832 1.152.1888.264.459.396.8106.396.3418 0 .6087-.13.8007-.391.1921-.263.2881-.683.2881-1.259 0-.492-.096-.873-.2881-1.143-.192-.27-.4622-.405-.8105-.405-.3451 0-.612.135-.8008.405-.1888.267-.2832.682-.2832 1.245z"/><path d="m84.3223 331h-1.4161v-5.283h1.4161zm-1.4991-6.65c0-.212.07-.386.21-.523.1432-.137.3369-.205.5811-.205.2408 0 .4329.068.5761.205.1433.137.2149.311.2149.523 0 .214-.0733.39-.2198.527-.1432.137-.3336.205-.5712.205-.2377 0-.4297-.068-.5762-.205-.1432-.137-.2149-.313-.2149-.527z"/><path d="m86.7881 325.717.0439.61c.3776-.472.8838-.708 1.5186-.708.5599 0 .9765.165 1.25.493.2734.329.4134.821.4199 1.475v3.413h-1.4111v-3.379c0-.299-.0651-.516-.1953-.649-.1302-.137-.3467-.205-.6495-.205-.3971 0-.6949.169-.8935.507v3.726h-1.4111v-5.283z"/><path d="m98.1797 329.081.6933-3.364h1.362l-1.3473 5.283h-1.1816l-1.001-3.325-1.001 3.325h-1.1768l-1.3476-5.283h1.3623l.6885 3.359.9668-3.359h1.0205z"/><path d="m104 331c-.065-.127-.112-.285-.142-.474-.341.381-.786.572-1.333.572-.517 0-.947-.15-1.289-.45-.338-.299-.507-.677-.507-1.132 0-.56.206-.99.62-1.289.416-.3 1.017-.451 1.801-.455h.65v-.302c0-.244-.064-.44-.191-.586-.123-.147-.32-.22-.59-.22-.238 0-.425.057-.562.171-.133.114-.2.27-.2.469h-1.411c0-.306.094-.589.283-.85.189-.26.456-.464.801-.61.345-.15.732-.225 1.162-.225.651 0 1.167.165 1.548.493.384.326.576.785.576 1.377v2.29c.003.502.073.881.21 1.138v.083zm-1.167-.981c.208 0 .4-.046.576-.137.176-.095.306-.22.391-.376v-.908h-.528c-.706 0-1.082.244-1.127.732l-.005.083c0 .176.061.321.185.435s.293.171.508.171z"/><path d="m107.789 331h-1.416v-7.5h1.416z"/><path d="m110.445 331h-1.416v-7.5h1.416z"/><path d="m114.044 331.098c-.775 0-1.406-.238-1.895-.713-.485-.475-.727-1.109-.727-1.9v-.136c0-.531.102-1.005.307-1.421.206-.42.495-.742.87-.967.377-.228.807-.342 1.289-.342.722 0 1.29.228 1.704.684.416.455.625 1.102.625 1.938v.576h-3.364c.045.345.182.622.41.83.231.209.522.313.874.313.543 0 .968-.197 1.274-.591l.693.777c-.211.299-.498.533-.859.703-.361.166-.762.249-1.201.249zm-.161-4.336c-.28 0-.508.094-.684.283-.172.189-.283.459-.332.81h1.963v-.112c-.006-.312-.091-.553-.254-.722-.163-.173-.394-.259-.693-.259z"/><path d="m118.712 324.418v1.299h.903v1.035h-.903v2.637c0 .195.037.335.112.42.075.084.218.127.43.127.156 0 .295-.012.415-.035v1.07c-.277.084-.562.127-.855.127-.989 0-1.494-.5-1.513-1.499v-2.847h-.772v-1.035h.772v-1.299z"/><path d="m125.953 331c-.065-.127-.112-.285-.141-.474-.342.381-.787.572-1.333.572-.518 0-.948-.15-1.29-.45-.338-.299-.507-.677-.507-1.132 0-.56.206-.99.62-1.289.416-.3 1.017-.451 1.802-.455h.649v-.302c0-.244-.064-.44-.191-.586-.123-.147-.32-.22-.59-.22-.238 0-.425.057-.562.171-.133.114-.2.27-.2.469h-1.411c0-.306.094-.589.283-.85.189-.26.456-.464.801-.61.345-.15.732-.225 1.162-.225.651 0 1.167.165 1.548.493.384.326.576.785.576 1.377v2.29c.003.502.073.881.21 1.138v.083zm-1.167-.981c.208 0 .401-.046.576-.137.176-.095.306-.22.391-.376v-.908h-.527c-.707 0-1.083.244-1.128.732l-.005.083c0 .176.062.321.185.435.124.114.293.171.508.171z"/><path d="m128.033 328.319c0-.823.184-1.479.552-1.967.371-.489.877-.733 1.519-.733.514 0 .939.192 1.274.576v-2.695h1.416v7.5h-1.274l-.069-.562c-.351.44-.804.66-1.357.66-.622 0-1.122-.244-1.499-.733-.375-.491-.562-1.173-.562-2.046zm1.411.103c0 .495.087.874.259 1.138.173.263.423.395.752.395.436 0 .744-.184.923-.552v-2.085c-.176-.367-.48-.551-.913-.551-.68 0-1.021.551-1.021 1.655z"/><path d="m133.668 328.319c0-.823.184-1.479.552-1.967.371-.489.877-.733 1.518-.733.515 0 .939.192 1.275.576v-2.695h1.416v7.5h-1.275l-.068-.562c-.352.44-.804.66-1.357.66-.622 0-1.122-.244-1.5-.733-.374-.491-.561-1.173-.561-2.046zm1.411.103c0 .495.086.874.259 1.138.172.263.423.395.752.395.436 0 .744-.184.923-.552v-2.085c-.176-.367-.48-.551-.913-.551-.681 0-1.021.551-1.021 1.655z"/><path d="m142.491 327.04c-.192-.026-.361-.039-.508-.039-.533 0-.883.181-1.049.542v3.457h-1.412v-5.283h1.333l.04.63c.283-.485.675-.728 1.176-.728.157 0 .303.021.44.064z"/><path d="m145.509 331.098c-.775 0-1.406-.238-1.895-.713-.485-.475-.727-1.109-.727-1.9v-.136c0-.531.102-1.005.307-1.421.205-.42.495-.742.869-.967.378-.228.808-.342 1.29-.342.722 0 1.29.228 1.704.684.416.455.625 1.102.625 1.938v.576h-3.365c.046.345.183.622.411.83.231.209.522.313.874.313.543 0 .968-.197 1.274-.591l.693.777c-.211.299-.498.533-.859.703-.361.166-.762.249-1.201.249zm-.161-4.336c-.28 0-.508.094-.684.283-.172.189-.283.459-.332.81h1.963v-.112c-.007-.312-.091-.553-.254-.722-.163-.173-.394-.259-.693-.259z"/><path d="m151.349 329.54c0-.172-.087-.308-.259-.405-.169-.101-.443-.191-.82-.269-1.257-.263-1.885-.797-1.885-1.601 0-.469.193-.86.581-1.172.39-.316.9-.474 1.528-.474.671 0 1.206.158 1.607.474.403.316.605.726.605 1.23h-1.411c0-.202-.065-.368-.195-.498-.131-.133-.334-.2-.611-.2-.237 0-.421.054-.551.161-.131.108-.196.244-.196.41 0 .157.073.283.22.381.15.095.4.178.752.249.351.069.648.147.889.235.745.273 1.118.747 1.118 1.42 0 .482-.207.873-.62 1.172-.414.297-.948.445-1.602.445-.443 0-.837-.078-1.182-.235-.341-.159-.61-.376-.805-.649-.196-.277-.293-.575-.293-.894h1.338c.013.251.105.443.278.576.172.134.404.201.693.201.271 0 .474-.051.611-.152.14-.104.21-.239.21-.405z"/><path d="m156.495 329.54c0-.172-.086-.308-.259-.405-.169-.101-.442-.191-.82-.269-1.256-.263-1.885-.797-1.885-1.601 0-.469.194-.86.581-1.172.391-.316.9-.474 1.529-.474.67 0 1.206.158 1.606.474.404.316.606.726.606 1.23h-1.412c0-.202-.065-.368-.195-.498-.13-.133-.334-.2-.61-.2-.238 0-.422.054-.552.161-.13.108-.195.244-.195.41 0 .157.073.283.219.381.15.095.401.178.752.249.352.069.648.147.889.235.745.273 1.118.747 1.118 1.42 0 .482-.207.873-.62 1.172-.413.297-.947.445-1.601.445-.443 0-.837-.078-1.182-.235-.342-.159-.61-.376-.806-.649-.195-.277-.293-.575-.293-.894h1.338c.013.251.106.443.278.576.173.134.404.201.694.201.27 0 .473-.051.61-.152.14-.104.21-.239.21-.405z"/></g></g><rect height="338" rx="8.5" stroke="#6c6c6c" stroke-opacity=".53" width="276" x="34.5" y="30.5"/></g></svg>
        </coral-dialog-content>

        <coral-dialog-footer>
            <button is="coral-button" variant="quiet" coral-close="">Close</button>
        </coral-dialog-footer>
    </coral-dialog>

    <!-- Hero -->
    <Hero
      v-bind:list="list"
      :submitIconDialog="'submitIcon'"
      :iconListLen="iconListLen"
    />

    <coral-toast id="errorToast" variant="error">
      {{ toastMsg }}
    </coral-toast>

    <coral-toast id="successToast" variant="success">
      😄 All icons have been uploaded.
    </coral-toast>

    <coral-toast id="iconUpdated" variant="success">
      All icons have been updated
    </coral-toast>

    <coral-toast id="iconApproved" variant="success">
      Icon has been approved
    </coral-toast>

    <coral-toast id="approveError" variant="error">
      There has been an error, please Approve again
    </coral-toast>

    <!-- <div style="display: none"> {{search}} </div> -->
    <!-- Icon Section -->
    <section class="content-wrapper">
    <!-- Search bar -->
      <div @click="isSearch = true" class="main-search-wrapper coral-bg p-b-15">
        <div class="m-auto main-search" style="max-width:300px;">
          <div class="shadow main-border-radius">
            <input v-model="searchString" :placeholder="'Search ' + iconListLen + ' icons'" type="text"  class="_coral-Search-input _coral-Textfield searchBar" name="name" aria-label="text input">
            <svg class="icon fill-dark" id="coral-css-icon-Magnifier" viewBox="0 0 16 16"><path d="M15.77 14.71l-4.534-4.535a6.014 6.014 0 1 0-1.06 1.06l4.533 4.535a.75.75 0 1 0 1.061-1.06zM6.5 11A4.5 4.5 0 1 1 11 6.5 4.505 4.505 0 0 1 6.5 11z"></path></svg>
          </div>
        </div>

      <!-- "Filter by" button -->
        <div class="filter-by-grid" @click="changeSortOrder">
          <div class="filter-by-wrapper coral-card shadow">
              <coral-icon class="h-full" :icon="icons.iconsOrder" title="Add"></coral-icon>
          </div>
        </div>
      </div>
      
    <!-- Waiting spinning circle -->
      <div v-if="this.$store.state.list == 0" class="waiting-wrapper">
        <coral-wait size="L" indeterminate=""></coral-wait>
      </div>

      <div v-if="noIcons" class="waiting-wrapper">
        <p class="coral-Body--S">
          No results
        </p>
      </div>

      <button v-if="isAuth" @click="logout" is="coral-button" variant="quiet">
        Logout
      </button>

    <!-- Icon list -->
        <div v-if="isAuth" class="icon-list-area p-t-20 p-b-50">
          <!-- Carbon ads -->
          <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>

          <!-- Search Bar -->
          <div  v-for="icon in search" :key="icon.appName+Math.floor(Math.random() * Math.floor(9999))" class="card-wrapper coral-card">
              <div class="card-img-wrapper" style="max-width: 120px;">
                
                <a :href="icon.icnsUrl">
                  <div v-lazy-container="{ selector: 'img', loading: coralIcons.loading }">
                    <img class="w-full" :data-src="icon.lowResPngUrl">
                  </div>
                </a>

                <div class="quick-actions-wrapper">
                  <div class="quick-action-el">
                    <coral-icon @click="showDialog('deleteDialog', icon)" class="h-full quick-action-icon" :icon="coralIcons.delete" title="Delete"></coral-icon>
                  </div>
                </div>
                  
              </div>

              <div class="p-l-15 p-r-15 p-b-15">

                  <p class="coral-Body--XS opacity-60 m-b-0">
                    <input class="editable-input coral-Body--XS opacity-50 m-b-0" @change="changeDate(icon, $event)" type="text" variant="quiet" :value="getDate(icon.timeStamp)" is="coral-textfield" aria-label="text input">
                  </p>
                  <h3 class="coral-font-color m-b-0">
                    <input class="editable-input f-w-800 m-b-0" @change="editDoc(icon, $event, 'appName')" type="text" variant="quiet" :value="prettifyName(icon.appName)" is="coral-textfield" aria-label="text input">
                  </h3>

                  <p class="coral-Body--XS p-b-0 opacity-80 m-b-0"><input class="editable-input" @change="editDoc(icon, $event, 'usersName')" type="text" variant="quiet" :value="icon.usersName" is="coral-textfield" aria-label="text input"></p>
                  <p class="coral-Body--XS p-b-0 opacity-50 m-b-0"><input class="editable-input small-text" @change="editDoc(icon, $event, 'credit')" type="text" variant="quiet" :value="icon.credit" is="coral-textfield" aria-label="text input"></p>
                  <div v-if="icon.email != 'user@email.com' && icon.email " class="p-t-10"> 
                    <a class="coral-Link" :href="'mailto:'+icon.email+'?subject=macOS icons submission&body='+icon.usersName">
                          email
                    </a>
                  </div>
              </div>
          </div>
        </div>

      <!-- Seen when no auth  -->
        <div v-if="!isAuth" class="icon-list-area p-t-20 p-b-50">

          <!-- Carbon ads -->
          <script async type="application/javascript" src="//cdn.carbonads.com/carbon.js?serve=CEBIK27J&placement=macosiconscom" id="_carbonads_js"></script>
          
          <a v-for="icon in search" :key="icon.appName+Math.floor(Math.random() * Math.floor(9999))" class="card-wrapper shadow coral-card" :href="icon.icnsUrl">
            <div class="card-img-wrapper">
              <div v-lazy-container="{ selector: 'img', loading: icons.loading }">
                <img class="w-full" :data-src="icon.lowResPngUrl">
              </div>
            </div>
            <div>
              <h3 class="coral-font-color">
                {{ prettifyName(icon.appName) }}
              </h3>
              <p class="coral-Body--XS opacity-60 m-b-20"><a class="coral-Link" :href="icon.credit" target="_blank">{{icon.usersName}}</a> on <span class="coral-Body--XS opacity-50">{{ getDate(icon.timeStamp) }}</span></p>
            </div>
          </a>
        </div>

      <!-- </div> -->

    </section>

    <!-- Footer -->
    <section>
      <footer class="p-b-20 coral-Body--S">
        Made with ❤️ by <a href="https://bit.ly/elias-webbites" target="_blank" class="coral-Link">Elias</a>
        <dir class="d-inline-block m-0 p-l-15 p-r-10">
          <hr class="coral-Divider--M coral-Divider--vertical m-0" style="height:14px;">
        </dir>
        <a href="https://www.paypal.com/donate?hosted_button_id=VS64ARMNSB67J" target="_blank" class="coral-Link">Support the project</a>
      </footer>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';

import Header from './Header.vue';
import Hero from './Hero.vue';
import iconCard from './iconCard.vue';
import Dialog from './Dialog.vue';
import deleteDialog from './deleteDialog.vue';

import algoliasearch from 'algoliasearch'
// import * as firebase from "firebase";
import { Search } from '@adobe/coral-spectrum';
import Parse from 'parse'

import dotenv from 'dotenv';
dotenv.config()

const VUE_APP_PARSE_APP_ID = process.env.VUE_APP_PARSE_APP_ID
const VUE_APP_PARSE_JAVASCRIPT_KEY = process.env.VUE_APP_PARSE_JAVASCRIPT_KEY
const VUE_APP_PARSE_MASTERKEY = process.env.VUE_APP_PARSE_MASTERKEY

Parse.initialize(VUE_APP_PARSE_APP_ID, VUE_APP_PARSE_JAVASCRIPT_KEY, VUE_APP_PARSE_MASTERKEY)
Parse.serverURL = 'https://onionicons.com/parse'

var Icons = Parse.Object.extend("Icons");
var icons = new Icons();

// let order = ["timeStamp", "desc"]
let order = ["appName", ""]
let lastVisible

console.log(process.env);

let algolia = {
    appid: process.env.VUE_APP_ALGOLIA_APPID,
    apikey: process.env.VUE_APP_ALGOLIA_KEY
}

const client = algoliasearch(algolia.appid, algolia.apikey);
const index = client.initIndex('macOS_parse')

const docLimit = 20

export default {
  name: 'Home',

  components: {
    Header,
    Hero,
    iconCard,
    Dialog,
    deleteDialog
  },

  data(){
    return{
      iconList:{},
      searchString: "",
      iconsToShow: [],
      list: [],

      scrolledToBottom: true,
      sortByName: true,
      sortBy: "appName",
      isSearch: false,
      noIcons: true,
      isAuth: false,
      
      howManyRecords: 0,

      iconListLen: "3,480",
      lastVisible: {},
      dataToShow: [],
      activeIcon: {},
      searchResults: [],
      icons:{
        success: require("../assets/icons/delete.svg"),
        namingOrder: require("../assets/icons/namingOrder.svg"),
        date: require("../assets/icons/date.svg"),
        loading: require("../assets/loading.gif"),
        iconsOrder: require("../assets/icons/namingOrder.svg")
      },
      coralIcons:{
        addIcon: require("../assets/icons/add.svg"),
        delete: require("../assets/icons/delete.svg"),
        newItem: require("../assets/icons/newItem.svg"),
        edit: require("../assets/icons/edit.svg"),
        loading: require("../assets/loading.gif"),
      }
    }
  },

  mounted: function(){
    let parent = this;

    this.getIconsArray();

    if(Parse.User.current()){
        console.log("Signed In");
        parent.isAuth = true
    }
  },

  methods:{ 

    logout(){
      console.log("HI");
      parent.isAuth = false
      Parse.User.logOut().then(() => {
        const currentUser = Parse.User.current();  // this will now be null
      });
    },

    prettifyName(name){
      // let newName = name
      for(let i in name){
        name = name.replace("_", " ")
      }
      // console.log(newName);
      return name
    },

    changeSortOrder(){
      let parent = this
      let sortByName = parent.sortByName
      let date = parent.icons.date
      let namingOrder = parent.icons.namingOrder
      
      console.log(sortByName);

      if (parent.sortByName) {
        parent.icons.iconsOrder = date
      } else{
        parent.icons.iconsOrder = namingOrder
      }

      parent.sortByName = !parent.sortByName
      
    },
    
    getDate(timeStamp){
      let newDate = new Date(timeStamp)
      
      let day = newDate.getUTCDate()
        if (day < 10) {
          day = "0"+day
        }
      let month = newDate.getUTCMonth() + 1
        if (month < 10) {
          month = "0"+month
        }
      let year = newDate.getFullYear()
      let date = day + "/" + month + "/" + year

      return date
    },

    async loadMore(){
      let parent = this
      let howManyRecords = parent.howManyRecords
      
      parent.howManyRecords = howManyRecords + docLimit

      const query = new Parse.Query(Icons);
      query.equalTo("approved", true)
      query.ascending(parent.sortBy);
      query.skip(howManyRecords);
      query.limit(docLimit);
      const results = await query.find()
      
      setTimeout(() => {
          parent.scrolledToBottom = true
      }, 800);

      for(let result in results){
        let objData = results[result].attributes
        let iconData = objData

        parent.$store.dispatch("pushDataToArr", {arr: "list", data: iconData, func: "loadMore"})
      }

    },

    scroll() {
      let parent = this
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.offsetHeight - (Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight) < 2000

        if (bottomOfWindow && parent.scrolledToBottom && !parent.isSearch) {
          parent.scrolledToBottom = false // replace it with your code
          parent.loadMore()
        }
      }
    },

    getIconListLen(){
      let parent = this
      dbCollection.onSnapshot(function(doc){
        parent.iconListLen = doc.docs.length
      })
    },

    async getIconsArray(){
      let parent = this

      const query = new Parse.Query(Icons);
      query.equalTo("approved", true)
      query.ascending(parent.sortBy);
      query.limit(docLimit);
      parent.howManyRecords = docLimit
      const results = await query.find()

      for(let result in results){
        let objData = results[result].attributes
        let iconData = {}
        
        for(let data in objData){
           iconData[data] = objData[data]
        }
        iconData.id = results[result].id

        parent.$store.commit('pushDataToArr', {arr: "list", data: iconData, func: "getIconsArray"})
      }

      setTimeout(() => {
        let carbon = document.getElementById("carbonads")
        carbon.classList.add("coral-card")
      }, 500);

      parent.scroll()

    },

    showDialog(dialogId, icon){
      let parent = this
      parent.activeIcon= icon
      document.getElementById(dialogId).show()
    },

    editDoc(icon, e, field){
      let newName = e.target.value
      let parent = this
      
      console.log(icon);
      console.log(newName);

      if (parent.isSearch) {
        db.collection("submissions").doc(icon.objectID).update({
          [field]: newName
        }).then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      } else{
        db.collection("submissions").doc(icon.id).update({
            [field]: newName
        }).then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      }
    },

    changeDate(icon, e){
        let date = e.target.value
        console.log(icon);
        
        // Get new input date and convert it to Unix miliseconds
        let day = date[0]+date[1]
        let month = date[3]+date[4]
        let year = date[6]+date[7]+date[8]+date[9]

        let newDate = new Date(month + "/" + day + "/" + year)
        let newTimeStamp = newDate.getTime()

        console.log(newDate);
        console.log(newTimeStamp);

        db.collection("submissions").doc(icon.id).update({
            timeStamp: newTimeStamp
        }).then(function() {
            console.log("Document successfully updated!");
        }).catch(function(error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
      },

  },

  watch:{
    searchString: function (search) {
      let parent = this
      
      index.search(search, {filters: `approved:true`, hitsPerPage: 150 }).then(function(responses) {
        // parent.dataToShow = responses.hits
        parent.$store.dispatch("setDataToArr", {arr: "dataToShow", data: responses.hits, func: "searchAlgolia"})
        // parent.$store.dispatch("pushDataToArr", {arr: "dataToShow", data: responses.hits, func: "searchAlgolia"})
      });
    }
  },

  computed:{

    toastMsg(){
      return this.$store.state.toastMsg
    },

    search(){
      let parent = this

      // If searchString is empty (no search by the user), return the full list of icons
      // if(!parent.searchString){
      if(!parent.searchString){
        parent.isSearch = false
        parent.noIcons = false
        parent.$store.state.dataToShow = parent.$store.state.list
        return parent.$store.state.dataToShow
      }

      if(parent.$store.state.dataToShow.length == 0){
        parent.noIcons = true
      } else{
        parent.noIcons = false
      }

      return parent.$store.state.dataToShow
      // return  parent.dataToShow
    },

    iconListStore(){
      return this.$store.state.list
    },

  },

  props: {
  }
}
</script>

<style>
  @import url(app.css);
  @import url(snack-helper.min.css);
  @import url(carbon.css);
</style>
