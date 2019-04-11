export default {
  getImage(list) {
    const requireContext = require.context("../Assets", true, /^\.\/.*\.*$/);
    const projectImgs = requireContext.keys().map(requireContext);
    let imageList = [];
    list.forEach(l => {
      projectImgs.forEach(p => {
        if (p.indexOf(l) > 0) {
          imageList.push(p);
        }
      });
    });
    return imageList;
  },
  getImg(list){
    let imageList = [];
    list.forEach(l=>{
      imageList.push(require(`../Assets/${l}`))
    })
    return imageList;
  }
};
