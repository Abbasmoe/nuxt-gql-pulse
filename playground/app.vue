<template>
  <div>
    <nav class="navigation">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/server">Server</NuxtLink>
    </nav>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
}
.navigation {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.navigation a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: bold;
  font-size: 18px;
}

.navigation a.router-link-exact-active {
  color: #42b983;
  text-decoration: underline;
}

.character-list-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.character-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  background: #fff;
}

.character-card:hover {
  transform: translateY(-5px);
}

.character-image {
  width: 100%;
  height: auto;
  display: block;
}

.character-details {
  padding: 15px;
}

.character-name {
  font-size: 1.4em;
  margin: 0 0 10px;
  color: #34495e;
}

.character-info {
  margin: 5px 0;
  font-size: 0.9em;
  color: #555;
}
</style>
