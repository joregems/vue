<template>
  <!-- <header class="nav navbar">
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="30" height="30" />
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <!-- <div class="navbar">
    <a href="#home">Home</a>
    <a href="#news">News</a>
    <a href="#contact">Contact</a>
  </div> -->
  <nav class="navbar">
    <RouterLink to="/" class="logo">
      <img alt="Vue logo" src="@/assets/logo.svg" width="40" height="40" />
      <h1>Vue</h1>
    </RouterLink>
    <RouterLink to="/" class="a">Home</RouterLink>
    <RouterLink to="/about" class="a">About</RouterLink>
  </nav>

  <!-- <div class="main">
    <p>Some text some text some text some text..</p>
  </div>  -->
  
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>

.sep {
  margin-left: 20;
  color: olivedrab;
  padding: 20px,20px;
  border: 1px ridge blue;
}
.logo {
  display: flex;
  margin-left: 1%;
  margin-right: 0%;
  /* border: 1px ridge blue; */
  height: auto;
}
.logo h1{
  color: #ddd;
  text-decoration: none;
  text-align: center;
  float: left;
}
 .navbar {
  z-index:  1;
  overflow: hidden;/* */
  display: flex;
  /* flex-direction: row-reverse; */
  background-color: var(--color-text);
  position: fixed;  /*Set the navbar to fixed position */
  top: 0; /*Position the navbar at the top of the page */
  width: 100%;  /*Full width */
}

/* Links inside the navbar */
.navbar .a {
  float: left;
  color: var(--color-background);
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

/* Change background on mouse-over */
.navbar .a:hover {
  background: #12d549;
  color: black;
}


.a.router-link-exact-active {
  color: red;
  background: #ddd;
}
/* Main content */
/* .main {
  margin-top: 30px;
}  */



/*.navbar {
  opacity: 1;
  width: 100vw;
  position: fixed;
  transform: translate3d(0, 0, 0);
  transition: 0.2s all ease-out;
}
.navbar.navbar--hidden {
  box-shadow: none;
  transform: translate3d(0, -100%, 0);
}

.nav {
  height: 40px;
  padding-right: 20px;
  padding-bottom: 5px;
  padding-left: 20px;
  text-align: center;
  z-index: 100;
}
.home {
}*/
/* 
.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>