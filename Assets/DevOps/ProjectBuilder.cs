#if UNITY_EDITOR

using System;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEditor.Build.Reporting;
using System.Linq;

public class ProjectBuilder : MonoBehaviour
{
    static string APP_NAME = "DemoPlatformer";

    static List<Platform> platforms = new List<Platform> {
        new Platform(BuildTarget.StandaloneOSX, $"MacOS/{APP_NAME}.app"),
        new Platform(BuildTarget.StandaloneWindows64, $"Win64/{APP_NAME}.exe"),
        new Platform(BuildTarget.StandaloneLinux64, $"Linux64/{APP_NAME}")
    };

    [MenuItem("Tools/Build/MacOS")]
    public static void BuildMacOS()
    {
        BuildPlatform(BuildTarget.StandaloneOSX);
    }

    [MenuItem("Tools/Build/Windows")]
    public static void BuildWindows64()
    {
        BuildPlatform(BuildTarget.StandaloneWindows64);
    }

    [MenuItem("Tools/Build/Linux")]
    public static void BuildLinux64()
    {
        BuildPlatform(BuildTarget.StandaloneLinux64);
    }

    [MenuItem("Tools/Build/All Platforms")]
    static void BuildAllPlatform()
    {
        List<string> scenes = GetAllScenes();

        foreach (var platform in platforms)
        {
            Build(scenes.ToArray(), platform.target, platform.executablePath);
        }
    }

    static void BuildPlatform(BuildTarget target)
    {
        List<string> scenes = GetAllScenes();
        Platform platform = platforms.Find(p => p.target == target);


        if (platform == null)
        {
            throw new NotSupportedException($"Target {target} is not supported.");
        }


        Build(scenes.ToArray(), platform.target, platform.executablePath);
    }

    static void BuildCLI()
    {
        string target = GetArg("-target");
        string output = GetArg("-output");

        if (target == null || output == null)
        {
            throw new NotSupportedException("Target and path are required.");
        }

        List<string> scenes = GetAllScenes();
        Build(scenes.ToArray(), (BuildTarget)Enum.Parse(typeof(BuildTarget), target), output);
    }

    static void Build(string[] scenes, BuildTarget target, string output, BuildOptions options = BuildOptions.None)
    {
        BuildPlayerOptions bpo = new BuildPlayerOptions();
        bpo.scenes = scenes;
        bpo.locationPathName = output;
        bpo.target = target;
        bpo.options = options;


        BuildReport report = BuildPipeline.BuildPlayer(bpo);
        BuildSummary summary = report.summary;

        Debug.Log("----------------------------------------");
        if (summary.result == BuildResult.Succeeded)
        {
            Debug.Log("Build succeeded: " + summary.totalSize + " bytes");
        }

        if (summary.result == BuildResult.Failed)
        {
            Debug.Log("Build failed");
        }
        Debug.Log("----------------------------------------");
    }

    private static string GetArg(string name)
    {
        var args = System.Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == name && args.Length > i + 1)
            {
                return args[i + 1];
            }
        }
        return null;
    }

    static List<string> GetAllScenes()
    {
        var projectScenes = new List<EditorBuildSettingsScene>(EditorBuildSettings.scenes);
        var scenePaths = projectScenes.Select(s => s.path).ToList();
        return scenePaths;
    }
}

class Platform
{
    public BuildTarget target;
    public string executablePath;

    public Platform(BuildTarget _target, string _executablePath)
    {
        target = _target;
        executablePath = _executablePath;
    }
}


#endif
