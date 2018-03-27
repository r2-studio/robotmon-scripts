cmake_minimum_required(VERSION 2.8)
project( TsumTest )
set (CMAKE_CXX_STANDARD 11)
find_package( OpenCV REQUIRED )

add_executable( find_diff find_diff.cpp )
add_executable( make_images make_images.cpp )

target_link_libraries( find_diff ${OpenCV_LIBS} )
target_link_libraries( make_images ${OpenCV_LIBS} )
