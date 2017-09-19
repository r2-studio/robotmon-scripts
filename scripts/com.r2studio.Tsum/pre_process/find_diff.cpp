#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>

int main( int argc, char** argv ) {
  cv::Mat src1 = cv::imread("../unpressed.jpg", 1);
  cv::Mat src2 = cv::imread("../pressed.jpg", 1);
  cv::Mat diffImg;

  cv::resize(src1, src1, cv::Size(src1.cols/10, src1.rows/10));
  cv::resize(src2, src2, cv::Size(src2.cols/10, src2.rows/10));

  cvtColor(src1,src1,CV_BGR2HLS);
  cvtColor(src2,src2,CV_BGR2HLS);

  cv::absdiff(src1, src2, diffImg);
  cv::threshold(diffImg, diffImg, 30, 255, cv::THRESH_BINARY);
  cv::erode(diffImg, diffImg, cv::getStructuringElement(cv::MORPH_RECT, cv::Size(5,5)));

  std::vector<std::vector<cv::Point> > contours;
  std::vector<cv::Vec4i> hierarchy;
  cv::Mat canny;
  cv::RNG rng(12345);
  Canny(diffImg, canny, 100, 200, 3);
  findContours( canny, contours, hierarchy, CV_RETR_TREE, CV_CHAIN_APPROX_SIMPLE, cv::Point(0, 0) );

  std::vector<cv::Moments> mu(contours.size() );
  for( int i = 0; i < contours.size(); i++ ) {
    mu[i] = moments( contours[i], false );
  }
  std::vector<cv::Point2f> mc( contours.size() );
  for( int i = 0; i < contours.size(); i++ ) {
    mc[i] = cv::Point2f( mu[i].m10/mu[i].m00 , mu[i].m01/mu[i].m00 );
  }
  
  for( int i = 0; i< contours.size(); i++ ) {
    
    if (contourArea(contours[i]) > 10 && hierarchy[i][2] > 0) {
      std::cout << contourArea(contours[i]) << std::endl;
      std::cout << mc[i] << std::endl;
      cv::Scalar color = cv::Scalar( rng.uniform(0, 255), rng.uniform(0,255), rng.uniform(0,255) );
      drawContours( diffImg, contours, i, color, 1, 4, hierarchy, 0, cv::Point() );
    }
    
  }


  // std::cout << diffImg << std::endl;
  // cv::imshow("Diff", diffImg);
  cv::imwrite("diff.png", diffImg);

  return 0;
}