export const state = () => ({
  title: 'My Blog',
  subtitle: ''
})

export const mutations = {
  setTitle (state, newTitle) {
    state.title = newTitle
  },
  setSubtitle (state, newSubtitle) {
    state.subtitle = newSubtitle
  }
}
