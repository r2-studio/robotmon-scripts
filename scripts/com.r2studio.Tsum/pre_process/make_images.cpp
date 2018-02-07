#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <iostream>
#include <string>

// usage: ./make_images filename cropX cropY cropW cropH resizeW resizeH

/*
  image mapping
  (7.2) 1080 -> 108 -> 150 -> 200
  (4.0) 60   -> 108 -> 15  -> 20
  (4.0) 48          -> 12  -> 16
*/
int main(int argc, char** argv) {
  std::string filename = std::string(argv[1]);
  int cropW = std::stoi(std::string(argv[2]));
  int resizeW = std::stoi(std::string(argv[3]));
  double scale = (double) resizeW / cropW;

  cv::Mat oImg = cv::imread(filename, 1);

  cv::Point2f center = cv::Point2f(oImg.cols / 2, oImg.rows / 2);
  cv::Rect cropROI((oImg.cols - resizeW) / 2, (oImg.rows - resizeW) / 2, resizeW, resizeW);
  filename = filename.replace(filename.size() - 4, 4, "");

  for (int angle = 0; angle < 360; angle += 45) {
    cv::Mat matrix = cv::getRotationMatrix2D(center, angle, scale);
    cv::Mat rotated;
    cv::warpAffine(oImg, rotated, matrix, oImg.size());
    cv::Mat cropped(rotated, cropROI);
    cv::imwrite(filename + "_" + std::to_string(angle) + ".png", cropped);
  }

  return 0;
}