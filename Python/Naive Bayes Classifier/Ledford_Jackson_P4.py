# -*- coding: utf-8 -*-
"""
Project 4 - Naive Bayes Classifier

Author: Jackson Ledford
"""

import numpy as np

def underFlowBlockerHam(vocab, words):
    chances = 0
    for i in vocab:
        if i in words:
            chances += np.log(vocab[i][0])
        else:
            chances += np.log(1 - vocab[i][0])
    return np.exp(chances)

def underFlowBlockerSpam(vocab, words):
    chances = 0
    for i in vocab:
        if i in words:
            chances += np.log(vocab[i][1])
        else:
            chances += np.log(1 - vocab[i][1])
    return np.exp(chances)
    

#Gets rid of symbols and whitespace, and makes all letters lowercase
def cleantext(text):
    text = text.lower()
    text = text.strip()
    for letters in text:
        if letters in """[]!.,_"-!—@;':#$%^&*()+/?""":
            text = text.replace(letters, " ")
    return text 

#Counts the number of duplicate words in the texts and gets rid of duplicate words
def countwords(words, is_spam, counted):
    for each_word in words:
        if each_word in counted:
            if is_spam == 1:
                counted[each_word][1]=counted[each_word][1] + 1
            else:
                counted[each_word][0]=counted[each_word][0] + 1
        else:
            if is_spam == 1:
                counted[each_word] = [0,1]
            else:
                counted[each_word] = [1,0]
    return counted

#Records each word appearing in spam or ham messages
def make_percent_list(k, theCount, spams, hams):
    for each_key in theCount:
        theCount[each_key][0] = (theCount[each_key][0] + k)/(2*k+hams)
        theCount[each_key][1] = (theCount[each_key][1] + k)/(2*k+spams)
    return theCount

def printOutcome(isSpam, spam, ham, totalEmails, testWords):
    print("There were " + str(spam) + " spam emails.")
    print("There were " + str(ham) + " ham emails.")
    
    TP = 0
    FP = 0
    TN = 0
    FN = 0
    total = 0
    
    for i in range(spam + ham):
        if(isSpam[i] == testWords[i]):
            if(isSpam[i] == 1):
                TP += 1
            elif(isSpam[i] == 0):
                TN += 1            
        elif(isSpam[i] != testWords[i]):
            if(isSpam[i] == 1):
                FP += 1
            elif(isSpam[i] == 0):
                FN += 1            
        total += 1
    
    accuracy = ((TP + TN) / (total)) * 100
    
    precision = ((TP) / (TP + FP)) * 100
    
    recall = ((TP) / (TP + FN)) * 100
    
    F1 = 2 * (1 / ((1 / precision) + (1 / recall)))
    
    print("FP = ", FP)
    print("FN = ", FN)
    print("TP = ", TP)
    print("TN = ", TN)
    print("Accuracy = ", round(accuracy, 2), "%")
    print("Precision = ", round(precision, 2), "%")
    print("Recall = ", round(recall, 2), "%")
    print("F1 = ", round(F1, 2), "%")


#Main
spam = 0
ham = 0
counted = dict()
trainFile = "Spam-Ham-Train.txt" #input("Enter the name of the spam-ham train file:" )
commonFile = "StopWords.txt" #input("Enter the name of the stop-words file:")
fin = open(commonFile, "r", encoding = 'unicode-escape')
textline = fin.readline()
stopWords = []
while textline != "":
    textline = cleantext(textline)
    stopWords.append(textline)
    textline = fin.readline()
   
fin.close()
fin = open(trainFile, "r", encoding = 'unicode-escape')
textline = fin.readline()
trainWords = []
while textline != "":
    is_spam = int(textline[:1])
    if is_spam == 1:
        spam = spam + 1
    else:
        ham = ham + 1
    textline = cleantext(textline[1:])
    trainWords.append(textline)
    words = textline.split()
    for word in stopWords:
        while word in words:
            words.remove(word)
    counted = countwords(words, is_spam, counted)
    textline = fin.readline()
vocab = (make_percent_list(1, counted, spam, ham))
fin.close()
#print(counted)

#print(vocab)

spam = 0
ham = 0
totalEmails = 0
testFile = "Spam-Ham-Test.txt" #input("Enter the name of the spam-ham test file:" )
fin = open(testFile, "r", encoding = 'unicode-escape')
textline = fin.readline()
while textline != "":
    if(int(textline[:1]) == 1):
        spam += 1
    else:
        ham += 1
    totalEmails += 1
    textline = fin.readline()    
fin.seek(0)   
textline = fin.readline() 
testWords = []
isSpam = []

while textline != "":
    testWords.append(int(textline[:1]))
    textline = cleantext(textline[1:])
    words = textline.split()
    spamChance = underFlowBlockerSpam(vocab, words)
    hamChance = underFlowBlockerHam(vocab, words)
    if((spamChance * (spam / totalEmails)) > (hamChance * (ham / totalEmails))):
        isSpam.append(1)
    else:
        isSpam.append(0)
    textline = fin.readline()
fin.close()

printOutcome(isSpam, spam, ham, totalEmails, testWords)

