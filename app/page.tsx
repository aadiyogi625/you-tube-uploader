"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, Play, CheckCircle, AlertCircle, Settings, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function YouTubeUploader() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [titleMode, setTitleMode] = useState<"single" | "multiple">("multiple")
  const [singleTitle, setSingleTitle] = useState("")
  const [multipleTitles, setMultipleTitles] = useState("")
  const [description, setDescription] = useState("")
  const [privacy, setPrivacy] = useState("public")
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [channelsUploaded, setChannelsUploaded] = useState(0)
  const [totalChannels, setTotalChannels] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [showDonePopup, setShowDonePopup] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `${timestamp} - ${message}`])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setVideoFile(file)
      addLog(`Video selected: ${file.name}`)
    }
  }

  const clearLogs = () => {
    setLogs([])
    addLog("Logs cleared")
  }

  const simulateUpload = async () => {
    // Validate inputs
    if (!videoFile) {
      addLog("Error: No video file selected")
      return
    }

    if (titleMode === "single" && !singleTitle.trim()) {
      addLog("Error: Single title mode selected, but title is empty")
      return
    }

    if (titleMode === "multiple") {
      const titles = multipleTitles
        .trim()
        .split("\n")
        .filter((t) => t.trim())
      if (titles.length === 0) {
        addLog("Error: Multiple title mode selected, but no titles entered")
        return
      }
    }

    // Start upload simulation
    setIsUploading(true)
    addLog(`Starting upload process with video: ${videoFile.name}`)

    // Simulate finding channels
    addLog("Retrieving list of brand channels...")
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock channel list
    const mockChannels = ["Brand Channel 1", "Brand Channel 2", "Brand Channel 3", "Brand Channel 4"]

    setTotalChannels(mockChannels.length)
    addLog(`Found ${mockChannels.length} channels`)

    // Get titles
    const titles =
      titleMode === "single"
        ? [singleTitle]
        : multipleTitles
            .trim()
            .split("\n")
            .filter((t) => t.trim())

    // Process each channel
    for (let i = 0; i < mockChannels.length; i++) {
      if (!isUploading) break

      const channelName = mockChannels[i]
      const title = titleMode === "single" ? singleTitle : titles[i % titles.length]

      addLog(`--- Processing Channel ${i + 1}/${mockChannels.length}: ${channelName} ---`)
      setProgress((i / mockChannels.length) * 100)

      // Simulate channel switch
      addLog(`Switching to channel: ${channelName}`)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate upload
      addLog(`Initiating upload for ${channelName}...`)
      addLog(`Setting title: "${title}"`)
      if (description) {
        addLog("Setting description")
      }
      addLog(`Setting privacy to: ${privacy}`)

      // Simulate processing
      addLog("Video processing...")
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate success
      addLog(`Video upload confirmed successfully for channel: ${channelName}`)
      setChannelsUploaded((prev) => prev + 1)

      // Wait between channels
      if (i < mockChannels.length - 1) {
        addLog("Waiting 2 seconds before next channel...")
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    }

    // Finish
    setProgress(100)
    addLog("Finished processing all channels")
    setIsUploading(false)
    setShowDonePopup(true)
  }

  const stopUpload = () => {
    setIsUploading(false)
    addLog("Upload process stopped by user")
  }

  const resetForm = () => {
    setVideoFile(null)
    setSingleTitle("")
    setMultipleTitles("")
    setDescription("")
    setPrivacy("public")
    setProgress(0)
    setChannelsUploaded(0)
    setTotalChannels(0)
    setLogs([])
    setShowDonePopup(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Upload className="mr-2" /> YouTube Brand Channel Uploader
      </h1>

      {showDonePopup && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">Upload Complete</AlertTitle>
          <AlertDescription>
            Finished uploading process. Successfully uploaded to {channelsUploaded} of {totalChannels} channels.
          </AlertDescription>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowDonePopup(false)}>
            Dismiss
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="upload">
            <TabsList className="mb-4">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <div className="space-y-6">
                {/* Video Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Video Selection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </div>
                    {videoFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Video Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Video Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Title Mode */}
                    <div>
                      <Label className="mb-2 block">Title Mode</Label>
                      <RadioGroup
                        value={titleMode}
                        onValueChange={(v) => setTitleMode(v as "single" | "multiple")}
                        className="flex space-x-4"
                        disabled={isUploading}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single Title</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multiple" id="multiple" />
                          <Label htmlFor="multiple">Multiple Titles (1 per line)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Title Input */}
                    {titleMode === "single" ? (
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={singleTitle}
                          onChange={(e) => setSingleTitle(e.target.value)}
                          placeholder="Enter video title"
                          disabled={isUploading}
                        />
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="titles">Titles (1 per line)</Label>
                        <Textarea
                          id="titles"
                          value={multipleTitles}
                          onChange={(e) => setMultipleTitles(e.target.value)}
                          placeholder="Enter one title per line"
                          rows={5}
                          disabled={isUploading}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter video description"
                        rows={4}
                        disabled={isUploading}
                      />
                    </div>

                    {/* Privacy */}
                    <div>
                      <Label htmlFor="privacy">Privacy</Label>
                      <Select value={privacy} onValueChange={setPrivacy} disabled={isUploading}>
                        <SelectTrigger id="privacy">
                          <SelectValue placeholder="Select privacy setting" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="unlisted">Unlisted</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex space-x-4">
                  {!isUploading ? (
                    <Button onClick={simulateUpload} disabled={!videoFile}>
                      <Play className="mr-2 h-4 w-4" /> Start Upload
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={stopUpload}>
                      Stop
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetForm} disabled={isUploading}>
                    Reset
                  </Button>
                </div>

                {/* Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>{isUploading ? "Uploading..." : "Ready"}</span>
                    </div>
                    <Progress value={progress} />
                    <div className="flex justify-between">
                      <span>Uploaded:</span>
                      <span>
                        {channelsUploaded}/{totalChannels} channels
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Chrome/Chromium Settings</CardTitle>
                  <CardDescription>
                    These settings are for demonstration purposes only. In a real application, these would configure the
                    browser automation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="profile-path">User Profile Path</Label>
                    <Input
                      id="profile-path"
                      placeholder="C:\Users\YourName\AppData\Local\Google\Chrome\User Data"
                      disabled={isUploading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="binary-path">Browser Binary Path (Optional)</Label>
                    <Input
                      id="binary-path"
                      placeholder="C:\Program Files\Google\Chrome\Application\chrome.exe"
                      disabled={isUploading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="driver-path">ChromeDriver Path (Optional)</Label>
                    <Input id="driver-path" placeholder="C:\WebDrivers\chromedriver.exe" disabled={isUploading} />
                    <p className="text-sm text-muted-foreground mt-1">
                      Leave blank to use webdriver-manager (if installed) or system PATH
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" disabled={isUploading}>
                    <Settings className="mr-2 h-4 w-4" /> Save Settings
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Timing Settings (seconds)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wait-timeout">Explicit Wait Timeout</Label>
                      <Input id="wait-timeout" type="number" defaultValue={30} min={1} disabled={isUploading} />
                      <p className="text-xs text-muted-foreground mt-1">Max time to wait for elements</p>
                    </div>
                    <div>
                      <Label htmlFor="page-load">Page Load Static Wait</Label>
                      <Input id="page-load" type="number" defaultValue={10} min={1} disabled={isUploading} />
                      <p className="text-xs text-muted-foreground mt-1">Wait after channel switch/major loads</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="channel-wait">Between Channels Static Wait</Label>
                    <Input id="channel-wait" type="number" defaultValue={5} min={1} disabled={isUploading} />
                    <p className="text-xs text-muted-foreground mt-1">Wait before starting next channel</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Logs</span>
                    <Button variant="outline" size="sm" onClick={clearLogs}>
                      Clear Logs
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                  <ScrollArea className="h-[500px] w-full rounded border p-4 font-mono text-sm">
                    {logs.length === 0 ? (
                      <p className="text-muted-foreground">No logs yet. Start an upload to see activity.</p>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className="pb-1">
                          {log}
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <List className="mr-2 h-4 w-4" /> Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Web Demo Version</AlertTitle>
                <AlertDescription>
                  This is a web demonstration of the YouTube Brand Channel Uploader. For full functionality with actual
                  YouTube uploads, you would need the desktop application that can control your browser.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <h3 className="font-semibold">How to use:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Select your video file</li>
                  <li>Choose title mode (single or multiple)</li>
                  <li>Enter title(s) - one per line for multiple mode</li>
                  <li>Add an optional description</li>
                  <li>Select privacy setting</li>
                  <li>Click "Start Upload" to begin the process</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Multiple Titles Mode:</h3>
                <p className="text-sm">
                  When using multiple titles mode, each channel will use the corresponding title from your list. If you
                  have more channels than titles, the list will cycle from the beginning.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Requirements:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Google Chrome or Chromium browser</li>
                  <li>Logged in to your YouTube account</li>
                  <li>Access to your brand channels</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
