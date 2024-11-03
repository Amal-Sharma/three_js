import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import LocomotiveScroll from 'locomotive-scroll';
const locomotiveScroll = new LocomotiveScroll();

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.z = 7

const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({canvas, antialias: true,alpha: true})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

// Post processing setup (sifi look dega)
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const rgbShiftPass = new ShaderPass(RGBShiftShader)
rgbShiftPass.uniforms['amount'].value = 0.0035
composer.addPass(rgbShiftPass)

// hdri light k lie
new RGBELoader()
  .load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = texture
   // scene.background = texture
  })

const loader = new GLTFLoader()
let model

// model k lie 
loader.load('/public/DamagedHelmet.gltf',function (gltf) {
    model = gltf.scene
    scene.add(model)
    model.position.set(0, 0, 0)
    model.scale.set(2, 2, 2)
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
  },
  function (error) {
    console.error('An error happened:', error)
  }
)

function animate(){
  window.requestAnimationFrame(animate)

  composer.render()
}
// for 3d model to move there should be a customized function instead of orbit controls
window.addEventListener("mousemove",(e)=>{
  if(model){
    gsap.to(model.rotation, {
      y: (e.clientX / window.innerWidth - 0.5) * Math.PI * 0.12,
      x: (e.clientY / window.innerHeight -0.5) * Math.PI * 0.12,
      duration: 0.9,
      ease: "power2.out"
    })
  }
})

window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth,window.innerHeight)
  composer.setSize(window.innerWidth,window.innerHeight)
})
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({
      behavior: 'smooth'
  });
}


animate()