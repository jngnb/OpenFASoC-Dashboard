//Given an array of integers, find the maximum product of two integers in an array. 
//(Print the pair of elements having maximum product. 
//In case, there are more than one pair of elements having maximum product, print any of the pair.)

//For example, consider the array {-10,-3,5,6,-2}. 
//The maximum product is formed by the (-10,-3) or (5,6) pair.

// #include <vector>
// #include <iostream>
// using namespace std;

// pair<int, int> maxProduct(vector<int> input){
//     if (input.size() < 2) return;
//     else if (input.size() < 3) return {input[0], input[1]};
    
//     sort(input.begin(), input.end());
//     int first = input[0]*input[1];
//     int second = input[input.size()-1]*input[input.size()-2];
//     if (first >= 0 && first >= second){
//         return {input[0], input[1]};
//     }
//     else if (second >= 0 && second >= first){
//         return {input[input.size()-1], input[input.size()-2]};
//     }
// }

// int main(){
//     vector<int> vec = {-10, -3, 5, 6, -2};
//     pair<int, int> result = maxProduct(vec);

//     cout << result.first << " " << result.second << endl;
//     return -1;
// }