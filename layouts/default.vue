<template>
  <div>
    <header>
      <nav>
        <a href="/">
          <nuxt-icon :width="60" :height="60" />
        </a>
        <ul>
          <li>
            <nuxt-link to="/">Home</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/about">About</nuxt-link>
          </li>
        </ul>
      </nav>
      <h1>{{ $store.state.title }}</h1>
      <p>{{ $store.state.subtitle }}</p>
    </header>
    <Nuxt />
  </div>
</template>

<script>
export default {
}
</script>
