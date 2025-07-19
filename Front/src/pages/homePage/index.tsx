import { Link } from "react-router-dom";


const HomePage = () => {

    return(
        <div className="flex h-screen justify-center items-center">
            <a target="_blank" href={"https://github.com/gkuch22/rdg"}  className="absolute bottom-5 right-5 hover:cursor-pointer hover:scale-110 duration-200">
               
                <svg className="w-10 h-10" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>github [#142]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]"> </path> </g> </g> </g> </g></svg>
            </a>
            <div className="flex flex-col gap-10 items-center max-w-lg text-center">
       <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-30 h-30 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#000000">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path style={{ fill: "#AEADB3" }} d="M425.347,468.992c-2.692,0-5.415-0.544-8.001-1.675c-17.573-7.7-81.137-32.815-161.348-32.815 s-143.772,25.117-161.344,32.814c-8.728,3.823-19.019,0.927-24.47-6.881c-5.453-7.809-4.623-18.466,1.968-25.341 C186.457,315.937,237.211,92.289,237.211,27.393h37.579c0,64.896,50.753,288.544,165.057,407.7 c6.594,6.876,7.422,17.533,1.969,25.342C437.978,465.931,431.746,468.992,425.347,468.992z M256,396.922 c45.128,0,85.512,7.323,116.679,15.573c-43.826-61.302-73.867-132.096-92.604-185.955c-9.769-28.08-17.756-55.189-24.076-80.274 c-6.32,25.085-14.306,52.194-24.076,80.274c-18.737,53.859-48.775,124.654-92.604,185.955 C170.489,404.247,210.872,396.922,256,396.922z"></path>
                <path style={{ fill: "#56545A" }} d="M439.847,435.093C325.543,315.937,274.79,92.289,274.79,27.393H256v118.872l0,0 c6.32,25.085,14.306,52.194,24.076,80.274c18.737,53.859,48.777,124.654,92.604,185.955c-31.168-8.25-71.551-15.573-116.679-15.573 l0,0V434.5l0,0c80.209,0,143.773,25.117,161.348,32.815c2.584,1.131,5.307,1.675,8.001,1.675c6.397,0,12.63-3.061,16.469-8.557 C447.267,452.626,446.439,441.969,439.847,435.093z"></path>
                <rect x="237.213" y="27.393" style={{ fill: "#88888F" }} width="37.579" height="457.214"></rect>
                <path style={{ fill: "#FF4F19" }} d="M510.695,132.83c-5.431-20.27-26.265-32.299-46.536-26.868l-26.215,7.024l-7.025-26.215 c-5.431-20.27-26.267-32.299-46.536-26.868c-20.27,5.431-32.299,26.267-26.868,46.536l26.693,99.619l99.619-26.693 C504.099,173.935,516.126,153.099,510.695,132.83z"></path>
                <g>
                  <path style={{ fill: "#AF2E08" }} d="M510.696,132.83c-5.431-20.27-26.267-32.299-46.536-26.868l-26.215,7.025l-53.735,93.071 l99.619-26.693C504.099,173.935,516.128,153.099,510.696,132.83z"></path>
                  <path style={{ fill: "#AF2E08" }} d="M127.617,59.904c-20.27-5.431-41.104,6.598-46.536,26.868l-7.025,26.215l8.478,54.1l45.258,38.971 l26.693-99.619C159.916,86.169,147.887,65.336,127.617,59.904z"></path>
                </g>
                <path style={{ fill: "#FF4F19" }} d="M1.304,132.83c5.431-20.27,26.267-32.299,46.536-26.868l26.215,7.025l53.735,93.071l-99.618-26.693 C7.902,173.935-4.127,153.099,1.304,132.83z"></path>
              </g>
            </svg>
          </div>
          <div>
            <h1 className=" text-3xl luckiest-guy-regular text-main">Guidee</h1>
          </div>
        </div>
        
            <p className="text-main">your personal AI travel assistant. Whether you're looking for hidden gems, popular attractions, or tailored experiences, Guidee helps you discover and choose the perfect tour based on your interests, budget, and travel style. Let your next adventure begin with smart suggestions, right at your fingertips.</p>

        
        <Link to={"chat"} className="py-3 font-semibold text-md duration-100 bg-main text-white px-4 rounded-[10px] hover:scale-105 hover:cursor-pointer">
            Start Chatting
        </Link>
        <div>
        </div>
        </div>
        </div>
    )

}

export default HomePage;